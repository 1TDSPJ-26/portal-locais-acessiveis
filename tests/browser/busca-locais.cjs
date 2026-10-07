// Automação opcional de navegador para a issue #116; npm test continua sem Playwright.
// Requer o servidor local (npm run dev ou npm run preview) em --base-url.
const { parseArgs } = require("node:util");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const { values } = parseArgs({
  options: {
    playwright: { type: "string", default: "playwright" },
    chromium: { type: "string" },
    saida: { type: "string", default: "work/issue116" },
    "base-url": { type: "string", default: "http://127.0.0.1:5173" },
  },
});

const { chromium } = require(values.playwright);
const destino = path.resolve(values.saida);
const base = values["base-url"];

fs.mkdirSync(destino, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(values.chromium ? { executablePath: values.chromium } : {}),
  });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const erros = [];
  page.on("pageerror", (erro) => erros.push(erro.message));

  const screenshot = (nome) => page.screenshot({ path: path.join(destino, `${nome}.png`) });
  const campo = page.locator("#campo-busca-locais");
  const busca = () => new URL(page.url()).searchParams.get("busca") ?? "";
  // A URL é atualizada em transição; espera ela alcançar o que foi digitado.
  const esperarBusca = (valor) =>
    page.waitForFunction((esperado) => (new URL(location.href).searchParams.get("busca") ?? "") === esperado, valor);

  await page.goto(`${base}/locais`);
  await page.getByText("6 locais encontrados", { exact: true }).waitFor();

  await campo.focus();
  await page.keyboard.type("parque das", { delay: 0 });
  await esperarBusca("parque das");
  assert.equal(await campo.inputValue(), "parque das");
  await page.getByText("1 local encontrado", { exact: true }).waitFor();
  await screenshot("01-digitacao-rapida");
  console.log("PASS: digitacao rapida nao perde letras no campo nem na URL");

  for (let i = 0; i < 4; i += 1) await page.keyboard.press("Backspace");
  await esperarBusca("parque");
  assert.equal(await campo.inputValue(), "parque");
  console.log("PASS: apagar rapido mantem campo e URL iguais");

  await page.getByRole("button", { name: /^Busca:/ }).click();
  await esperarBusca("");
  assert.equal(await campo.inputValue(), "");
  console.log("PASS: remover o filtro da busca limpa o campo");

  await campo.focus();
  await page.keyboard.type("cine", { delay: 0 });
  await esperarBusca("cine");
  await page.getByRole("button", { name: "Limpar filtros", exact: true }).first().click();
  await esperarBusca("");
  assert.equal(await campo.inputValue(), "");
  console.log("PASS: limpar filtros limpa o campo");

  await campo.focus();
  await page.keyboard.type("cine", { delay: 0 });
  await esperarBusca("cine");
  await page.getByRole("link", { name: "Cine Horizonte", exact: true }).click();
  await page.waitForURL(/\/locais\/6$/);
  await page.goBack();
  await esperarBusca("cine");
  assert.equal(await campo.inputValue(), "cine");
  console.log("PASS: voltar do detalhe mantem a busca no campo");

  await page.goto(`${base}/locais?busca=museu`);
  await page.getByText("1 local encontrado", { exact: true }).waitFor();
  assert.equal(await campo.inputValue(), "museu");
  assert.equal(busca(), "museu");
  console.log("PASS: busca vinda da URL preenche o campo");

  assert.deepEqual(erros, []);
  await browser.close();
})().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
