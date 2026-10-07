// Automacao opcional de navegador para a issue #73; npm test continua sem Playwright.
const { parseArgs } = require("node:util");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { values } = parseArgs({
  options: {
    playwright: { type: "string", default: "playwright" },
    chromium: { type: "string" },
    saida: { type: "string", default: "work/issue73" },
    "base-url": { type: "string", default: "http://127.0.0.1:5173" },
  },
});

const { chromium } = require(values.playwright);
const destino = path.resolve(values.saida);
const base = values["base-url"];
const fixture = `${base}/tests/fixtures/locais.html`;

fs.mkdirSync(destino, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(values.chromium ? { executablePath: values.chromium } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, colorScheme: "light" });
  const erros = [];
  page.on("pageerror", (erro) => erros.push(erro.message));

  const screenshot = (nome) => page.screenshot({ path: path.join(destino, `${nome}.png`), fullPage: true });
  const tem = async (locator) => {
    await locator.waitFor();
    assert(await locator.isVisible());
  };

  await page.goto(`${fixture}?cenario=carregando&rota=/locais/1/editar`);
  await tem(page.getByText("Carregando local...", { exact: true }));
  await page.locator("#nome").waitFor();
  await page.waitForFunction(() => document.querySelector("#nome")?.value === "Biblioteca Parque");

  assert.equal(await page.locator("#categoria").inputValue(), "Cultura");
  assert.match(await page.locator("#endereco").inputValue(), /Rua das Palmeiras/);
  await screenshot("01-formulario-preenchido-apos-carga");
  console.log("PASS: formulario de edicao e preenchido apos a carga inicial");

  await page.locator("#nome").fill("Biblioteca Parque Renovada");
  await page.locator("#descricao").fill("Espaco revisado durante a validacao da issue 73.");
  await page.locator("#endereco").fill("Rua das Palmeiras, 120 - Centro");
  await page.locator("#email").fill("biblioteca@example.com");
  await page.getByRole("checkbox", { name: "Libras", exact: true }).check();
  await page.getByRole("button", { name: "Salvar alterações", exact: true }).click();

  await tem(page.getByRole("heading", { name: "Biblioteca Parque Renovada", exact: true }));
  await tem(page.getByText("Biblioteca Parque Renovada foi atualizado com sucesso.", { exact: true }));
  await tem(page.getByText("Espaco revisado durante a validacao da issue 73.", { exact: true }));
  await tem(page.getByText("biblioteca@example.com", { exact: true }));
  await tem(page.getByText("Libras", { exact: true }));
  await screenshot("02-detalhe-atualizado");
  console.log("PASS: edicao salva, navega para detalhe e exibe mensagem de sucesso");

  await page.getByRole("link", { name: "Editar local", exact: true }).click();
  await page.locator("#nome").waitFor();
  await page.locator("#nome").fill("Museu da Cidade");
  await page.locator("#endereco").fill("Praça da Estação, 8 · Centro");
  await page.getByRole("button", { name: "Salvar alterações", exact: true }).click();
  await tem(page.getByRole("alert").getByText("Já existe um local cadastrado com este nome e endereço.", { exact: true }));
  await screenshot("03-duplicidade-bloqueada");
  console.log("PASS: duplicidade com outro local e bloqueada na edicao");

  assert.deepEqual(erros, []);
  await browser.close();
})().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
