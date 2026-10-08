// Execução: node tests/browser/reserva-locais.cjs <caminho-do-playwright>
const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1366, height: 1000 } });
    const erros = [];
    page.on('pageerror', erro => erros.push(erro.message));
    await page.goto('http://127.0.0.1:5173/locais');
    await page.locator('.place-card').first().waitFor();
    const total = await page.locator('.place-card').count();
    const aviso = page.getByRole('heading', { name: 'Exibindo dados de reserva' });
    const tentar = page.getByRole('button', { name: 'Tentar novamente' });
    for (const bruto of ['{inválido', '{"nao":"lista"}', '']) {
      await page.evaluate(valor => localStorage.setItem('locais-cadastrados', valor), bruto);
      await page.reload();
      await aviso.waitFor();
      assert.equal(await page.locator('.place-card').count(), total);
      assert.equal(await page.evaluate(() => localStorage.getItem('locais-cadastrados')), bruto);
      assert.equal(await aviso.locator('xpath=ancestor::*[@aria-live][1]').getAttribute('aria-live'), 'polite');
      await tentar.click();
      await aviso.waitFor();
      assert.equal(await page.evaluate(() => localStorage.getItem('locais-cadastrados')), bruto);
    }
    fs.mkdirSync('docs/cp2/issue-85', { recursive: true });
    await page.screenshot({ path: 'docs/cp2/issue-85/reserva-desktop.png', fullPage: true });
    await page.setViewportSize({ width: 375, height: 812 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: 'docs/cp2/issue-85/reserva-mobile.png', fullPage: true });
    const salvo = [{ id: 85, nome: 'Local recuperado', categoria: 'Cultura', endereco: 'Rua Teste, 85', recursos: [] }];
    await page.evaluate(lista => localStorage.setItem('locais-cadastrados', JSON.stringify(lista)), salvo);
    await tentar.focus();
    await page.keyboard.press('Enter');
    await page.getByRole('heading', { name: 'Local recuperado', exact: true }).waitFor();
    assert.equal(await aviso.count(), 0);
    assert.equal(await page.locator('.place-card').count(), 1);
    await page.evaluate(() => localStorage.setItem('locais-cadastrados', '[]'));
    await page.reload();
    await page.getByRole('heading', { name: 'Nenhum local cadastrado', exact: true }).waitFor();
    assert.equal(await aviso.count(), 0);
    // Contexto isolado: simula bloqueio de leitura e escrita do armazenamento.
    const bloqueada = await browser.newPage();
    await bloqueada.addInitScript(() => {
      Storage.prototype.getItem = () => { throw new Error('Armazenamento bloqueado'); };
      Storage.prototype.setItem = () => { throw new Error('Armazenamento bloqueado'); };
    });
    await bloqueada.goto('http://127.0.0.1:5173/locais');
    await bloqueada.getByRole('heading', { name: 'Exibindo dados de reserva' }).waitFor();
    assert.equal(await bloqueada.locator('.place-card').count(), total);
    assert.deepEqual(erros, []);
    console.log('PASS: reserva, preservação do armazenamento, nova falha, recuperação pelo teclado, lista vazia, armazenamento bloqueado e layout mobile.');
  } finally {
    await browser.close();
  }
})().catch(erro => { console.error(erro); process.exitCode = 1; });

