// Teste opcional da #137; usa Playwright externo, sem mudar as dependências.
const { parseArgs } = require("node:util");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { values } = parseArgs({ options: {
  playwright: { type: "string", default: "playwright" },
  chromium: { type: "string" },
  saida: { type: "string", default: "work/issue137.local" },
  "base-url": { type: "string", default: "http://127.0.0.1:53137" },
} });
const { chromium } = require(values.playwright);
const destino = path.resolve(values.saida);
const base = values["base-url"];
fs.mkdirSync(destino, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true,
    ...(values.chromium ? { executablePath: values.chromium } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, colorScheme: "light" });
    const erros = [];
    page.on("pageerror", (erro) => erros.push(erro.message));
    const cards = page.locator("article.place-card");
    const titulo = page.locator("#titulo-lista-favoritos");
    const vazio = page.getByText("Você ainda não tem locais favoritos nesta lista.", { exact: true });
    const menu = page.getByRole("button", { name: "Menu de navegação", exact: true });
    const nav = page.getByRole("navigation", { name: "Navegação principal" });
    const linkFavoritos = nav.getByRole("link", { name: "Favoritos", exact: true });
    const favorito = (nome) => page.getByRole("button", { name: `Favoritar ${nome}`, exact: true });
    const foco = async (locator) => assert(await locator.evaluate((el) => el === document.activeElement));
    const semRolagemHorizontal = async () => assert(await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth));
    const imagem = (nome) => page.screenshot({ path: path.join(destino, `${nome}.jpg`),
      type: "jpeg", quality: 65, fullPage: true });

    await page.goto(`${base}/favoritos`);
    await vazio.waitFor();
    assert.equal(await cards.count(), 0);
    await nav.getByRole("link", { name: "Locais", exact: true }).click();
    await favorito("Café Aurora").waitFor();
    const dados = await page.evaluate(() => JSON.parse(localStorage.getItem("locais-cadastrados")));
    for (const nome of ["Café Aurora", "Biblioteca Parque"]) {
      await favorito(nome).focus();
      await favorito(nome).press("Space");
      assert.equal(await favorito(nome).getAttribute("aria-pressed"), "true");
    }
    await linkFavoritos.focus();
    await linkFavoritos.press("Enter");
    await titulo.filter({ hasText: "2 locais favoritos" }).waitFor();
    assert.equal(await page.title(), "Favoritos | Portal de Locais e Serviços Acessíveis");
    assert.equal(await page.getByRole("heading", { name: "Meus favoritos", exact: true }).count(), 1);
    assert.deepEqual(await cards.locator("h3").allTextContents(), ["Biblioteca Parque", "Café Aurora"]);
    assert.equal(await linkFavoritos.getAttribute("aria-current"), "page");
    assert.match(await linkFavoritos.getAttribute("class"), /\bactive\b/);
    assert.match(await linkFavoritos.evaluate((el) => getComputedStyle(el).textDecorationLine), /underline/);
    await semRolagemHorizontal();
    await imagem("favoritos-desktop");
    await page.reload();
    await titulo.filter({ hasText: "2 locais favoritos" }).waitFor();
    assert.deepEqual(await cards.locator("h3").allTextContents(), ["Biblioteca Parque", "Café Aurora"]);
    console.log("PASS: rota, quantidade, ordem alfabética, link ativo e persistência ao recarregar");

    await page.setViewportSize({ width: 390, height: 844 });
    await menu.focus();
    await menu.press("Enter");
    assert.equal(await menu.getAttribute("aria-expanded"), "true");
    const links = nav.getByRole("link");
    await menu.press("Shift+Tab");
    await foco(links.last());
    await links.last().press("Tab");
    await foco(menu);
    await menu.press("Tab");
    await foco(links.first());
    await links.first().press("Tab");
    await page.keyboard.press("Tab");
    await foco(linkFavoritos);
    await linkFavoritos.press("Shift+Tab");
    await foco(nav.getByRole("link", { name: "Locais", exact: true }));
    await page.keyboard.press("Tab");
    await foco(linkFavoritos);
    await semRolagemHorizontal();
    assert.match(await linkFavoritos.evaluate((el) => getComputedStyle(el).textDecorationLine), /underline/);
    await imagem("favoritos-mobile");
    await page.keyboard.press("Escape");
    await foco(menu);
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await menu.press("Enter");
    await nav.getByRole("link", { name: "Locais", exact: true }).press("Enter");
    await page.waitForURL(`${base}/locais`);
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await menu.press("Enter");
    await linkFavoritos.press("Enter");
    await page.waitForURL(`${base}/favoritos`);
    assert.equal(await menu.getAttribute("aria-expanded"), "false");
    await semRolagemHorizontal();
    console.log("PASS: menu mobile, Tab/Shift+Tab, Escape e fechamento ao navegar");

    await page.setViewportSize({ width: 1366, height: 900 });
    for (const [indice, nome] of ["Biblioteca Parque", "Café Aurora"].entries()) {
      await favorito(nome).focus();
      await favorito(nome).press("Enter");
      await titulo.filter({ hasText: indice === 0 ? "1 local favorito" : "0 locais favoritos" }).waitFor();
      await foco(titulo);
      await page.getByRole("status").filter({ hasText: `Local ${nome} (` }).waitFor();
      assert.equal(await cards.count(), 1 - indice);
    }
    await vazio.waitFor();
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("locais-favoritos"))), []);
    await page.reload();
    await vazio.waitFor();
    console.log("PASS: remoção por teclado, foco no título, anúncio e estado vazio persistente");

    await page.evaluate(() => {
      localStorage.setItem("locais-favoritos", "[1,99]");
      localStorage.setItem("locais-cadastrados", "{invalido");
    });
    await page.reload();
    await page.getByRole("heading", { name: "Exibindo dados de reserva", exact: true }).waitFor();
    assert.deepEqual(await cards.locator("h3").allTextContents(), ["Biblioteca Parque"]);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem("locais-favoritos"))), [1, 99]);
    await page.evaluate((salvos) => localStorage.setItem("locais-cadastrados", JSON.stringify([
      ...salvos, { ...salvos[0], id: 99, nome: "Local recuperado" },
    ])), dados);
    await page.getByRole("button", { name: "Tentar novamente", exact: true }).click();
    await favorito("Local recuperado").waitFor();
    assert.equal(await cards.count(), 2);
    assert.equal(await page.getByRole("heading", { name: "Exibindo dados de reserva", exact: true }).count(), 0);
    console.log("PASS: reserva mantém os IDs e nova tentativa recupera a lista salva");

    await page.evaluate((local) => {
      localStorage.setItem("locais-cadastrados", JSON.stringify([81, 82].map((id) =>
        ({ ...local, id, nome: "Mesmo nome", endereco: `Rua ${id}` }))));
      localStorage.setItem("locais-favoritos", "[81,82]");
    }, dados[0]);
    await page.goto(`${base}/favoritos`);
    await titulo.filter({ hasText: "2 locais favoritos" }).waitFor();
    for (const id of [81, 82]) {
      await favorito("Mesmo nome").first().press("Enter");
      await page.getByRole("status").filter({ hasText: `Local Mesmo nome (Rua ${id}) removido dos favoritos.` }).waitFor();
      await foco(titulo);
    }
    await page.evaluate(() => localStorage.setItem("locais-favoritos", "[1]"));
    console.log("PASS: nomes repetidos têm anúncios distintos pelo endereço");

    await page.goto(`${base}/tests/fixtures/pagina-favoritos.html?cenario=carregando`);
    await page.getByRole("status").filter({ hasText: "Carregando locais..." }).waitFor();
    assert.equal(await cards.count(), 0);
    assert.equal(await vazio.count(), 0);
    await titulo.filter({ hasText: "1 local favorito" }).waitFor();
    await page.goto(`${base}/tests/fixtures/pagina-favoritos.html?cenario=erro`);
    await page.getByRole("alert").filter({ hasText: "Não foi possível carregar os locais" }).waitFor();
    assert.equal(await cards.count(), 0);
    assert.equal(await vazio.count(), 0);
    await page.getByRole("button", { name: "Tentar novamente", exact: true }).press("Enter");
    await titulo.filter({ hasText: "1 local favorito" }).waitFor();
    assert.equal(await cards.count(), 1);
    assert.deepEqual(erros, []);
    console.log("PASS: carregamento e erro sem cartões/estado vazio prematuros; nova tentativa funciona");
  } finally {
    await browser.close();
  }
})().catch((erro) => { console.error(erro); process.exit(1); });
