const { chromium } = require(process.argv[2] || "playwright");
const assert = require("node:assert/strict");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.BROWSER_CHANNEL || "msedge",
  });

  try {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 1000 },
    });

    const erros = [];
    page.on("pageerror", (erro) => erros.push(erro.message));

    await page.goto("http://127.0.0.1:5173/locais");

    const primeiroCartao = page.locator(".place-card").first();
    await primeiroCartao.waitFor();

    const nomeLocal = (
      await primeiroCartao.locator(".place-card-title").innerText()
    ).trim();

    // Garante que o teste começa sem favoritos salvos.
    await page.evaluate(() => {
      localStorage.removeItem("locais-favoritos");
    });
    await page.reload();

    const cartaoAposRecarga = page
      .locator(".place-card")
      .filter({
        has: page.getByRole("link", {
          name: nomeLocal,
          exact: true,
        }),
      })
      .first();

    const botaoFavoritar = cartaoAposRecarga
      .getByRole("button", { name: /Favoritar/ })
      .first();

    await botaoFavoritar.waitFor();
    await botaoFavoritar.click();

    assert.equal(
      await page.evaluate(() => {
        return JSON.parse(
          localStorage.getItem("locais-favoritos") || "[]",
        ).length;
      }),
      1,
      "O favorito deve ser salvo no localStorage",
    );

    assert.equal(
      await cartaoAposRecarga
        .getByRole("button", { name: /Favoritar/ })
        .first()
        .getAttribute("aria-pressed"),
      "true",
      "O botão deve indicar que o local está favoritado",
    );

    // Verifica se o favorito aparece na página própria.
    await page.goto("http://127.0.0.1:5173/favoritos");

    await page.getByRole("heading", {
      name: nomeLocal,
      exact: true,
    }).waitFor();

    // Confirma a persistência após recarregar a página.
    await page.reload();

    await page.getByRole("heading", {
      name: nomeLocal,
      exact: true,
    }).waitFor();

    const cartaoFavoritos = page
      .locator(".place-card")
      .filter({
        has: page.getByRole("link", {
          name: nomeLocal,
          exact: true,
        }),
      })
      .first();

    const botaoDesfavoritar = cartaoFavoritos
      .getByRole("button", { name: /Favoritar/ })
      .first();

    await botaoDesfavoritar.click();

    await page.getByRole("heading", {
      name: "Você ainda não tem locais favoritos nesta lista.",
      exact: true,
    }).waitFor();

    assert.deepEqual(
      await page.evaluate(() => {
        return JSON.parse(
          localStorage.getItem("locais-favoritos") || "[]",
        );
      }),
      [],
      "A remoção deve ser persistida no localStorage",
    );

    assert.deepEqual(
      erros,
      [],
      "A página não deve gerar erros JavaScript",
    );

    console.log(
      "PASS: favoritar, persistir, recarregar, abrir /favoritos, desfavoritar e verificar estado vazio.",
    );
  } finally {
    await browser.close();
  }
})().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});