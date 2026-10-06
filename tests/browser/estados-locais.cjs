// Automação opcional de navegador; npm test continua independente do Playwright.
const { parseArgs } = require('node:util');
const { values } = parseArgs({ options: {
  playwright: { type: 'string', default: 'playwright' },
  chromium: { type: 'string' },
  saida: { type: 'string', default: 'work/issue70' },
  'base-url': { type: 'string', default: 'http://127.0.0.1:5173' },
} });
const { chromium } = require(values.playwright);
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const destino = path.resolve(values.saida);
const base = values['base-url'];
const fixture = `${base}/tests/fixtures/locais.html`;
fs.mkdirSync(destino, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true, ...(values.chromium ? { executablePath: values.chromium } : {}) });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, colorScheme: 'light' });
  const erros = [];
  page.on('pageerror', erro => erros.push(erro.message));
  const screenshot = nome => page.screenshot({ path: path.join(destino, nome + '.png'), fullPage: true });
  const tem = async (locator) => { await locator.waitFor(); assert(await locator.isVisible()); };
  const pronto = async (quantidade = 6) => {
    await page.locator('.place-card').nth(quantidade - 1).waitFor();
    assert.equal(await page.locator('.place-card').count(), quantidade);
  };

  await page.goto(`${fixture}?cenario=carregando`);
  await tem(page.getByText('Carregando locais...', { exact: true }));
  assert.equal(await page.locator('.search-field output').innerText(), '');
  assert(!await page.getByText('Nenhum local encontrado', { exact: true }).isVisible());
  assert.equal(await page.getByText('Carregando locais...', { exact: true }).getAttribute('aria-live'), 'polite');
  await screenshot('01-carregando');
  await pronto();
  assert.equal(await page.locator('.search-field output').innerText(), '6 locais encontrados');
  await screenshot('02-com-dados');
  console.log('PASS: carregamento anunciado, contador oculto, StrictMode sem duplicação (6 locais)');

  await page.getByRole('searchbox').fill('local inexistente 987');
  await tem(page.getByRole('heading', { name: 'Nenhum local encontrado', exact: true }));
  await screenshot('03-busca-sem-resultado');
  await page.locator('.empty-state').getByRole('button', { name: 'Limpar filtros', exact: true }).click();
  await pronto();
  await page.getByRole('radio', { name: 'Cultura', exact: true }).check();
  assert.equal(await page.locator('.place-card').count(), 2);
  await page.getByRole('checkbox', { name: 'Libras', exact: true }).check();
  assert.equal(await page.locator('.place-card').count(), 1);
  console.log('PASS: busca vazia, limpar filtros, filtros por categoria e recurso preservados');

  await page.goto(`${fixture}?cenario=erro`);
  const retry = page.getByRole('button', { name: 'Tentar novamente', exact: true });
  await retry.waitFor();
  await tem(page.getByRole('alert').getByRole('heading', { name: 'Não foi possível carregar os locais', exact: true }));
  assert.equal(await page.locator('.place-card').count(), 0);
  await screenshot('04-erro');
  await retry.click();
  await tem(page.getByText('Carregando locais...', { exact: true }));
  assert.equal(await page.locator('.search-field output').innerText(), '');
  await retry.waitFor();
  await tem(page.getByRole('alert').getByRole('heading', { name: 'Não foi possível carregar os locais', exact: true }));
  assert.equal(await page.locator('.place-card').count(), 0);
  await screenshot('07-nova-tentativa-com-erro');
  console.log('PASS: uma segunda falha mantém mensagem, nova tentativa e ausência de dados de reserva');

  await page.getByLabel('Teste da issue #70 — cenário da próxima carga:').selectOption('vazio');
  await retry.click();
  await tem(page.getByText('Carregando locais...', { exact: true }));
  await tem(page.getByRole('heading', { name: 'Nenhum local cadastrado', exact: true }));
  assert(!await retry.isVisible());
  assert.equal(await page.locator('.place-card').count(), 0);
  await tem(page.locator('.empty-state').getByRole('link', { name: 'Cadastrar local', exact: true }));
  await screenshot('08-nova-tentativa-com-lista-vazia');
  console.log('PASS: nova tentativa que retorna lista vazia encerra o erro e oferece cadastro');

  await page.goto(`${fixture}?cenario=erro`);
  await retry.waitFor();
  await page.getByRole('searchbox').fill('Biblioteca');
  await page.getByLabel('Teste da issue #70 — cenário da próxima carga:').selectOption('pronto');
  await retry.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  assert(await retry.evaluate(el => el === document.activeElement && getComputedStyle(el).outlineStyle !== 'none'));
  await page.keyboard.press('Enter');
  await tem(page.getByText('Carregando locais...', { exact: true }));
  await pronto(1);
  assert.equal(await page.getByRole('searchbox').inputValue(), 'Biblioteca');
  assert.equal(await page.locator('.search-field output').innerText(), '1 local encontrado');
  await tem(page.getByRole('heading', { name: 'Biblioteca Parque', exact: true }));
  await page.getByRole('searchbox').fill('');
  await pronto();
  console.log('PASS: erro anunciado, recuperação pelo teclado, foco visível e busca preservada após recarga');

  await page.goto(`${fixture}?cenario=vazio`);
  await tem(page.getByRole('heading', { name: 'Nenhum local cadastrado', exact: true }));
  assert(!await page.getByRole('heading', { name: 'Nenhum local encontrado', exact: true }).isVisible());
  const cadastro = page.locator('.empty-state').getByRole('link', { name: 'Cadastrar local', exact: true });
  assert.equal(await cadastro.getAttribute('href'), '/cadastrar');
  await screenshot('05-lista-vazia');
  await cadastro.click();
  await tem(page.getByRole('heading', { name: 'Cadastro', exact: true }));
  assert(await page.getByRole('button', { name: 'Cadastrar local', exact: true }).isEnabled());
  console.log('PASS: lista vazia distinta de busca sem resultado e link ao cadastro funcional');

  await page.goto(`${fixture}?cenario=carregando&rota=/cadastrar`);
  await tem(page.getByText('Carregando locais. Aguarde para enviar o cadastro.', { exact: true }));
  const submit = page.getByRole('button', { name: 'Cadastrar local', exact: true });
  assert(await submit.isDisabled());
  await page.waitForFunction(() => !document.querySelector('button[type="submit"]').disabled);
  const campos = { nome: 'Espaço de teste 70', descricao: 'Local acessível usado apenas nesta verificação.', logradouro: 'Rua de Teste', numero: '70', bairro: 'Centro', cidade: 'São Paulo', cep: '01001-000', email: 'teste@example.com' };
  for (const [id, value] of Object.entries(campos)) await page.locator(`#${id}`).fill(value);
  await page.locator('#categoria').selectOption('Cultura');
  await page.locator('#estado').selectOption('SP');
  await page.getByRole('checkbox', { name: 'Entrada sem degraus', exact: true }).check();
  await submit.click();
  await page.getByRole('link', { name: 'Ver o local na listagem', exact: true }).click();
  await pronto(7);
  await tem(page.getByRole('heading', { name: 'Espaço de teste 70', exact: true }));
  console.log('PASS: cadastro impedido durante carga e preservado após carga inicial');

  await page.goto(`${fixture}?cenario=erro&rota=/cadastrar`);
  await tem(page.getByText('Não foi possível carregar os locais para conferir o cadastro.', { exact: true }));
  assert(await page.getByRole('button', { name: 'Cadastrar local', exact: true }).isDisabled());
  await page.getByRole('link', { name: 'Ir à listagem para tentar novamente', exact: true }).click();
  await retry.waitFor();
  console.log('PASS: cadastro informa falha e oferece caminho para tentar novamente');

  for (const cenario of ['erro-obsoleto', 'vazio-obsoleto']) {
    await page.goto(`${fixture}?cenario=${cenario}`);
    await pronto();
    await page.waitForTimeout(2200);
    await pronto();
    assert(!await page.getByRole('heading', { name: 'Nenhum local cadastrado', exact: true }).isVisible());
    assert(!await retry.isVisible());
  }
  console.log('PASS: StrictMode descarta erro e lista vazia de efeitos desmontados');

  await page.setViewportSize({ width: 375, height: 812 });
  for (const cenario of ['carregando', 'erro', 'vazio']) {
    await page.goto(`${fixture}?cenario=${cenario}`);
    await page.getByText(cenario === 'carregando' ? 'Carregando locais...' : cenario === 'erro' ? 'Não foi possível carregar os locais' : 'Nenhum local cadastrado', { exact: true }).waitFor();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth));
    await screenshot(`06-mobile-${cenario}`);
  }
  console.log('PASS: estados sem rolagem horizontal em 375px');

  await page.setViewportSize({ width: 1366, height: 900 });
  await page.goto(`${base}/locais`);
  await pronto();
  assert.equal(await page.locator('#cenario').count(), 0);
  assert.deepEqual(erros, []);
  console.log('PASS: rota real /locais carrega 6 itens, sem controles de teste e sem erros JavaScript');
  await browser.close();
})().catch(erro => { console.error(erro); process.exit(1); });
