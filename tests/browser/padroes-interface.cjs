// Verificação opcional: não instala dependências e não integra npm test.
// node tests/browser/padroes-interface.cjs --playwright <módulo> --chromium <executável> --base-url http://127.0.0.1:5180 --fase antes
const { parseArgs } = require('node:util');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { values } = parseArgs({ options: {
  playwright: { type: 'string', default: 'playwright' },
  chromium: { type: 'string' },
  'base-url': { type: 'string', default: 'http://127.0.0.1:5173' },
  saida: { type: 'string', default: 'docs/cp2/issue-80' },
  fase: { type: 'string', default: 'depois' },
} });
assert(['antes', 'depois'].includes(values.fase), '--fase deve ser antes ou depois');
const { chromium } = require(values.playwright);
const destino = path.resolve(values.saida, values.fase);
const fixture = `${values['base-url']}/tests/fixtures/locais.html`;
fs.mkdirSync(destino, { recursive: true });
const temas = [
  { nome: 'claro', colorScheme: 'light', alto: false },
  { nome: 'escuro', colorScheme: 'dark', alto: false },
  { nome: 'alto-contraste', colorScheme: 'light', alto: true },
];
const logs = [];
const medidas = [];
const registrar = mensagem => { logs.push(mensagem); console.log(mensagem); };
const verificar = values.fase === 'depois';

async function preencherCadastro(page, nome) {
  const campos = { nome, descricao: 'Local acessível utilizado somente na verificação automatizada.', logradouro: 'Rua de Teste', numero: '80', bairro: 'Centro', cidade: 'São Paulo', cep: '01001-000', email: 'teste@example.com' };
  for (const [id, valor] of Object.entries(campos)) await page.locator(`#${id}`).fill(valor);
  await page.locator('#categoria').selectOption('Cultura');
  await page.locator('#estado').selectOption('SP');
  await page.getByRole('checkbox', { name: 'Entrada sem degraus', exact: true }).check();
}

async function capturaTopo(page, nome, altura = 1000) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(destino, `${nome}.png`), clip: { x: 0, y: 0, width: 1366, height: altura } });
}

(async () => {
  const browser = await chromium.launch({ headless: true, ...(values.chromium ? { executablePath: values.chromium } : {}) });
  const erros = [];
  try {
    for (const tema of temas) {
      const context = await browser.newContext({ viewport: { width: 1366, height: 1100 }, colorScheme: tema.colorScheme });
      const page = await context.newPage();
      page.on('pageerror', erro => erros.push(erro.message));
      await page.goto(`${fixture}?rota=/cadastrar&cenario=pronto`);
      const submit = page.getByRole('button', { name: 'Cadastrar local', exact: true });
      await submit.waitFor();
      await page.waitForFunction(() => !document.querySelector('button[type="submit"]').disabled);
      if (tema.alto) await page.getByRole('button', { name: 'Alto contraste', exact: true }).click();
      await page.locator('header').first().screenshot({ path: path.join(destino, `${tema.nome}-header.png`) });
      if (verificar) await verificarBotoes(page, `${tema.nome}: cadastro inicial`);
      await submit.click();
      const resumo = page.getByRole('heading', { name: 'Corrija os campos antes de enviar', exact: true }).locator('xpath=ancestor::*[@role="alert"][1]');
      await resumo.waitFor();
      await capturaTopo(page, `${tema.nome}-cadastro-invalido`);
      if (verificar) await verificarCadastroInvalido(page, resumo, tema.nome);
      await preencherCadastro(page, `Espaço de teste 80 ${tema.nome}`);
      await submit.click();
      const sucesso = page.getByRole('heading', { name: 'Cadastro concluído', exact: true });
      await sucesso.waitFor();
      await capturaTopo(page, `${tema.nome}-cadastro-sucesso`);
      if (verificar) await verificarCadastroSucesso(page, sucesso, tema.nome);
      await page.evaluate(() => localStorage.setItem('locais-cadastrados', '{inválido'));
      await page.goto(`${fixture}?rota=/locais&cenario=pronto`);
      await page.getByRole('heading', { name: 'Exibindo dados de reserva', exact: true }).waitFor();
      await capturaTopo(page, `${tema.nome}-listagem-reserva`, 1100);
      if (verificar) await verificarListagem(page, tema.nome);
      await page.setViewportSize({ width: 375, height: 812 });
      const menu = page.getByRole('button', { name: 'Menu de navegação', exact: true });
      await menu.focus();
      await page.keyboard.press('Enter');
      await page.locator('nav#menu-principal').waitFor({ state: 'visible' });
      await page.locator('header').first().screenshot({ path: path.join(destino, `${tema.nome}-header-mobile.png`) });
      if (verificar) {
        await page.screenshot({ path: path.join(destino, `${tema.nome}-menu-mobile.png`) });
        await verificarMenu(page, menu, tema.nome);
      }
      await verificarSemOverflow(page, `${tema.nome}: cadastro mobile após navegação`);
      if (verificar) {
        await page.setViewportSize({ width: 1366, height: 1100 });
        await verificarEdicao(page, tema.nome);
      }
      await context.close();
      registrar(`${verificar ? 'PASS' : 'CAPTURA ANTES'}: ${tema.nome}, cadastro inválido/sucesso, reserva e Header desktop/mobile.`);
    }
    assert.deepEqual(erros, [], 'Erros JavaScript no navegador');
    if (verificar) registrar('PASS: zero erros JavaScript. Sem teste com leitor de tela real; semântica e anúncios conferidos pelo DOM.');
    fs.writeFileSync(path.join(destino, 'browser.txt'), logs.join('\n') + '\n', 'utf8');
    if (verificar) fs.writeFileSync(path.join(destino, 'verificacoes.json'), JSON.stringify(medidas, null, 2) + '\n', 'utf8');
  } finally {
    await browser.close();
  }
})().catch(erro => { console.error(erro); process.exitCode = 1; });

async function verificarClasse(locator, classe, contexto) {
  assert(await locator.evaluate((el, nome) => el.classList.contains(nome), classe), `${contexto}: falta classe ${classe}`);
}

async function verificarBotoes(page, contexto) {
  const botoes = page.locator('button:visible, a.botao:visible');
  const resultados = await botoes.evaluateAll(elementos => elementos.map(el => {
    const caixa = el.getBoundingClientRect();
    return { nome: el.getAttribute('aria-label') || el.textContent.trim(), largura: caixa.width, altura: caixa.height, classe: el.className };
  }));
  for (const botao of resultados) {
    assert(botao.largura >= 44 && botao.altura >= 44, `${contexto}: alvo ${botao.nome} tem ${botao.largura}×${botao.altura}px`);
    assert(botao.classe.split(/\s+/).includes('botao'), `${contexto}: ${botao.nome} sem base .botao`);
  }
  assert(resultados.length > 0, `${contexto}: nenhum botão examinado`);
  medidas.push({ contexto, alvos: resultados });
  await verificarContraste(page, 'button:visible, a.botao:visible', contexto);
}

// A composição considera transparência dos fundos até o canvas. Os controles
// testados têm fundo sólido; não é uma auditoria de gradientes/imagens da página.
async function verificarContraste(page, seletor, contexto) {
  const cores = await page.locator(seletor).evaluateAll(elementos => {
    const rgba = cor => {
      const partes = cor.match(/[\d.]+/g)?.map(Number) || [0, 0, 0];
      return [...partes.slice(0, 3), partes[3] ?? 1];
    };
    const sobre = (frente, fundo) => {
      const alfa = frente[3] + fundo[3] * (1 - frente[3]);
      if (alfa === 0) return [0, 0, 0, 0];
      return [0, 1, 2].map(i => (frente[i] * frente[3] + fundo[i] * fundo[3] * (1 - frente[3])) / alfa).concat(alfa);
    };
    const luminancia = cor => {
      const canais = cor.slice(0, 3).map(c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
      return canais[0] * 0.2126 + canais[1] * 0.7152 + canais[2] * 0.0722;
    };
    return elementos.filter(el => el.getClientRects().length && el.type !== 'checkbox' && el.type !== 'radio').map(el => {
      const estilo = getComputedStyle(el);
      let fundo = [0, 0, 0, 0];
      for (let atual = el; atual && fundo[3] < 1; atual = atual.parentElement) fundo = sobre(fundo, rgba(getComputedStyle(atual).backgroundColor));
      fundo = sobre(fundo, [255, 255, 255, 1]);
      const texto = sobre(rgba(estilo.color), fundo);
      const lt = luminancia(texto), lf = luminancia(fundo);
      return { nome: el.getAttribute('aria-label') || el.id || el.textContent.trim().slice(0, 80), texto: estilo.color, fundo: fundo.slice(0, 3).map(c => Math.round(c)), razao: (Math.max(lt, lf) + 0.05) / (Math.min(lt, lf) + 0.05) };
    });
  });
  for (const cor of cores) assert(cor.razao >= 4.5, `${contexto}: contraste ${cor.nome} ${cor.razao.toFixed(2)}:1 (<4.5)`);
  medidas.push({ contexto, contraste: cores });
}

async function verificarFoco(page, locator, contexto) {
  await locator.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  const foco = await locator.evaluate(el => {
    const estilo = getComputedStyle(el);
    return { ativo: el === document.activeElement, visivel: el.matches(':focus-visible'), outline: estilo.outlineStyle, largura: estilo.outlineWidth, sombra: estilo.boxShadow };
  });
  assert(foco.ativo && foco.visivel, `${contexto}: foco por teclado ausente`);
  assert((foco.outline !== 'none' && parseFloat(foco.largura) >= 2) || foco.sombra !== 'none', `${contexto}: indicador visual de foco ausente`);
  medidas.push({ contexto, foco });
}

async function verificarSemOverflow(page, contexto) {
  const geometria = await page.evaluate(() => ({ viewport: innerWidth, documento: document.documentElement.scrollWidth, corpo: document.body.scrollWidth }));
  assert(geometria.documento <= geometria.viewport && geometria.corpo <= geometria.viewport, `${contexto}: rolagem horizontal (${JSON.stringify(geometria)})`);
  if (verificar) medidas.push({ contexto, geometria });
}

async function verificarCadastroInvalido(page, resumo, tema, ids = ['nome', 'categoria', 'descricao', 'logradouro', 'numero', 'bairro', 'cidade', 'estado', 'cep', 'email'], tela = 'cadastro') {
  for (const classe of ['mensagem', 'mensagem--erro', 'mensagem--painel']) await verificarClasse(resumo, classe, `${tema}: resumo`);
  assert.equal(await resumo.getAttribute('role'), 'alert');
  await page.waitForFunction(() => document.activeElement?.textContent.includes('Corrija os campos antes de enviar'));
  assert(await resumo.evaluate(el => el === document.activeElement), `${tema}: resumo sem foco`);
  const anuncios = await page.locator('[role="alert"]').evaluateAll(elementos => elementos.filter(el => el.textContent.trim()).length);
  assert.equal(anuncios, 1, `${tema}: validação anunciou mais de um alerta`);
  for (const id of ids) {
    const campo = page.locator(`#${id}`);
    await verificarClasse(campo, 'campo', `${tema}: ${id}`);
    assert.equal(await campo.getAttribute('aria-invalid'), 'true');
    assert.equal(await campo.getAttribute('aria-describedby'), `${id}-erro`);
    const erro = page.locator(`#${id}-erro`);
    for (const classe of ['mensagem', 'mensagem--erro', 'mensagem--campo']) await verificarClasse(erro, classe, `${tema}: ${id}-erro`);
    assert.equal(await erro.getAttribute('role'), null, `${tema}: erro de campo duplicou anúncio`);
    assert.equal(await erro.getAttribute('aria-live'), null, `${tema}: erro de campo duplicou região viva`);
    const borda = await campo.evaluate(el => {
      const estilo = getComputedStyle(el);
      const erro = document.getElementById(`${el.id}-erro`);
      return { largura: parseFloat(estilo.borderTopWidth), cor: estilo.borderTopColor, corErro: getComputedStyle(erro.querySelector('.mensagem-tipo')).color };
    });
    assert(borda.largura >= 2 && borda.cor === borda.corErro, `${tema}: ${id} sem borda reforçada na cor do erro`);
    medidas.push({ contexto: `${tema}: ${id}`, borda });
  }
  assert(await page.locator('.campo-checkbox').count() > 0, `${tema}: padrão checkbox ausente`);
  await verificarFoco(page, page.locator('#nome'), `${tema}: campo inválido`);
  await verificarContraste(page, '.mensagem--campo:visible, .mensagem--painel:visible, .mensagem-tipo:visible, #nome, #categoria, #descricao, #cep, #email', `${tema}: erros e campos`);
  registrar(`PASS: ${tema}, ${tela}: resumo único com foco, ${ids.length} erros associados e sem anúncios individuais, bordas, foco e contraste de campos/mensagens ≥4.5:1.`);
}

async function verificarCadastroSucesso(page, titulo, tema) {
  const painel = titulo.locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " mensagem--sucesso ")][1]');
  await painel.waitFor();
  for (const classe of ['mensagem', 'mensagem--sucesso', 'mensagem--painel']) await verificarClasse(painel, classe, `${tema}: sucesso`);
  assert.equal(await painel.getAttribute('role'), null, `${tema}: confirmação focada não deve repetir anúncio vivo`);
  assert.equal(await painel.getAttribute('aria-live'), null, `${tema}: confirmação focada não deve repetir região viva`);
  assert.equal(await page.getByRole('region', { name: 'Cadastro concluído', exact: true }).count(), 1, `${tema}: região nomeada da confirmação ausente`);
  await page.waitForFunction(() => document.activeElement?.id === 'titulo-cadastro-concluido');
  assert(await titulo.evaluate(el => el === document.activeElement));
  await verificarClasse(page.getByRole('link', { name: 'Ver o local na listagem', exact: true }), 'botao--primario', `${tema}: link primário`);
  await verificarClasse(page.getByRole('button', { name: 'Cadastrar outro local', exact: true }), 'botao--secundario', `${tema}: novo cadastro`);
  await verificarBotoes(page, `${tema}: sucesso`);
  await verificarContraste(page, '.mensagem--sucesso:visible, .mensagem--sucesso .mensagem-tipo, .mensagem--sucesso h2, .mensagem--sucesso h3, .mensagem--sucesso p', `${tema}: mensagem de sucesso`);
  await page.getByRole('button', { name: 'Cadastrar outro local', exact: true }).click();
  await page.waitForFunction(() => document.activeElement?.id === 'nome');
  assert.equal(await page.locator('#nome').inputValue(), '');
  await verificarFoco(page, page.locator('#nome'), `${tema}: campo sem erro`);
  await verificarContraste(page, '.campo:visible, label:visible', `${tema}: novo formulário`);
  registrar(`PASS: ${tema}, confirmação recebe foco, ação primária e secundária ≥44×44px, novo cadastro limpa campos e devolve foco ao nome.`);
}

async function verificarListagem(page, tema) {
  const aviso = page.getByRole('heading', { name: 'Exibindo dados de reserva', exact: true });
  const painel = aviso.locator('xpath=ancestor::*[contains(concat(" ", normalize-space(@class), " "), " mensagem--aviso ")][1]');
  await painel.waitFor();
  for (const classe of ['mensagem', 'mensagem--aviso', 'mensagem--painel']) await verificarClasse(painel, classe, `${tema}: reserva`);
  assert.equal(await painel.getAttribute('aria-live'), 'polite');
  assert.equal(await painel.getAttribute('role'), 'status');
  assert.equal(await page.evaluate(() => localStorage.getItem('locais-cadastrados')), '{inválido');
  await page.setViewportSize({ width: 375, height: 812 });
  await verificarSemOverflow(page, `${tema}: listagem mobile ainda com reserva`);
  await verificarBotoes(page, `${tema}: listagem mobile ainda com reserva`);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: path.join(destino, `${tema}-listagem-reserva-mobile.png`) });
  await painel.screenshot({ path: path.join(destino, `${tema}-aviso-reserva-mobile.png`) });
  await page.setViewportSize({ width: 1366, height: 1100 });
  await verificarBotoes(page, `${tema}: listagem com reserva`);
  await verificarContraste(page, '.mensagem--aviso:visible, .mensagem--aviso .mensagem-tipo, .mensagem--aviso h2, .mensagem--aviso p, input[type="search"]', `${tema}: aviso reserva e busca`);
  const retry = page.getByRole('button', { name: 'Tentar novamente', exact: true });
  await verificarFoco(page, retry, `${tema}: tentar novamente`);
  const salvo = [{ id: 80, nome: 'Local recuperado 80', categoria: 'Cultura', endereco: 'Rua de Teste, 80', recursos: [] }];
  await page.evaluate(lista => localStorage.setItem('locais-cadastrados', JSON.stringify(lista)), salvo);
  await retry.focus();
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Local recuperado 80', exact: true }).waitFor();
  assert.equal(await aviso.count(), 0, `${tema}: aviso não encerrou depois da recuperação`);
  assert.equal(await page.locator('.place-card').count(), 1);
  registrar(`PASS: ${tema}, aviso reserva anunciado, armazenamento inválido preservado e recuperação por Enter encerra o aviso.`);
}

async function verificarEdicao(page, tema) {
  const original = { id: 80, nome: `Local de edição 80 ${tema}`, categoria: 'Cultura', endereco: 'Rua de Teste, 80', descricao: 'Descrição completa do local utilizado na verificação de edição.', email: 'teste@example.com', recursos: ['Entrada sem degraus'] };
  await page.evaluate(local => localStorage.setItem('locais-cadastrados', JSON.stringify([local])), original);
  await page.goto(`${fixture}?rota=/locais/80/editar&cenario=pronto`);
  const nome = page.locator('#nome');
  await nome.waitFor();
  assert.equal(await nome.inputValue(), original.nome);
  const salvar = page.getByRole('button', { name: 'Salvar alterações', exact: true });
  const cancelar = page.getByRole('button', { name: 'Cancelar', exact: true });
  await verificarClasse(salvar, 'botao--primario', `${tema}: salvar edição`);
  await verificarClasse(cancelar, 'botao--secundario', `${tema}: cancelar edição`);
  await verificarBotoes(page, `${tema}: edição inicial`);
  await verificarContraste(page, '.campo:visible, .campo-rotulo:visible, .campo-checkbox-label:visible', `${tema}: campos de edição`);
  await nome.fill(`Rascunho cancelado ${tema}`);
  await cancelar.click();
  await page.getByRole('heading', { name: original.nome, exact: true }).waitFor();
  const nomeSalvo = await page.evaluate(() => JSON.parse(localStorage.getItem('locais-cadastrados'))[0].nome);
  assert.equal(nomeSalvo, original.nome, `${tema}: cancelar alterou o local salvo`);
  assert.equal((await page.locator('.mensagem--sucesso').innerText()).trim(), '', `${tema}: cancelar exibiu confirmação de alteração`);
  await page.getByRole('link', { name: 'Editar local', exact: true }).click();
  await nome.waitFor();
  for (const id of ['nome', 'descricao', 'endereco', 'email']) await page.locator(`#${id}`).fill('');
  await page.locator('#categoria').selectOption('');
  await page.locator('#telefone').fill('inválido');
  await page.locator('#site').fill('inválido');
  await salvar.click();
  const resumo = page.getByRole('heading', { name: 'Corrija os campos antes de enviar', exact: true }).locator('xpath=ancestor::*[@role="alert"][1]');
  await resumo.waitFor();
  await capturaTopo(page, `${tema}-edicao-invalida`);
  await verificarCadastroInvalido(page, resumo, tema, ['nome', 'categoria', 'descricao', 'endereco', 'email', 'telefone', 'site'], 'edição');
  const editado = `Local editado 80 ${tema}`;
  const campos = { nome: editado, descricao: original.descricao, endereco: original.endereco, email: original.email, telefone: '(11) 91234-5678', site: 'https://example.com' };
  for (const [id, valor] of Object.entries(campos)) await page.locator(`#${id}`).fill(valor);
  await page.locator('#categoria').selectOption(original.categoria);
  await page.setViewportSize({ width: 375, height: 812 });
  await verificarSemOverflow(page, `${tema}: edição mobile`);
  await verificarBotoes(page, `${tema}: edição mobile`);
  await verificarFoco(page, salvar, `${tema}: salvar edição mobile`);
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: editado, exact: true }).waitFor();
  const feedback = page.locator('.mensagem--sucesso').filter({ hasText: `${editado} foi atualizado com sucesso.` });
  await feedback.waitFor();
  assert.equal(await feedback.getAttribute('role'), 'status');
  assert.equal(await feedback.getAttribute('aria-live'), 'polite');
  const atualizado = await page.evaluate(() => JSON.parse(localStorage.getItem('locais-cadastrados'))[0]);
  assert.equal(atualizado.nome, editado);
  assert.equal(atualizado.id, original.id);
  await verificarSemOverflow(page, `${tema}: detalhe mobile após edição`);
  await verificarContraste(page, '.mensagem--sucesso:visible, .mensagem--sucesso .mensagem-tipo', `${tema}: edição confirmada`);
  await feedback.screenshot({ path: path.join(destino, `${tema}-edicao-sucesso-mobile.png`) });
  registrar(`PASS: ${tema}, edição: Salvar primário/Cancelar secundário, cancelar preserva dados, validação com sete erros e salvar por Enter mantém id/persiste nome/mostra confirmação cortês; listagem reserva e edição verificadas em 375px.`);
}

async function verificarMenu(page, menu, tema) {
  assert.equal(await menu.getAttribute('aria-expanded'), 'true');
  const nav = page.getByRole('navigation', { name: 'Navegação principal', exact: true });
  await page.keyboard.press('Tab');
  assert(await nav.getByRole('link', { name: 'Home', exact: true }).evaluate(el => el === document.activeElement));
  await verificarFoco(page, nav.getByRole('link', { name: 'Home', exact: true }), `${tema}: link do menu mobile`);
  const links = await nav.getByRole('link').evaluateAll(elementos => elementos.map(el => {
    const caixa = el.getBoundingClientRect();
    return { nome: el.textContent.trim(), largura: caixa.width, altura: caixa.height };
  }));
  for (const link of links) assert(link.largura >= 44 && link.altura >= 44, `${tema}: link mobile ${link.nome} abaixo de 44×44px`);
  medidas.push({ contexto: `${tema}: links do menu mobile`, alvos: links });
  await verificarContraste(page, 'nav#menu-principal a:visible', `${tema}: links do menu mobile`);
  await page.keyboard.press('Shift+Tab');
  assert(await menu.evaluate(el => el === document.activeElement));
  await page.keyboard.press('Shift+Tab');
  assert(await nav.getByRole('link', { name: 'Acessibilidade', exact: true }).evaluate(el => el === document.activeElement));
  await page.keyboard.press('Tab');
  assert(await menu.evaluate(el => el === document.activeElement));
  await verificarBotoes(page, `${tema}: menu mobile aberto`);
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert(await menu.evaluate(el => el === document.activeElement));
  await verificarFoco(page, menu, `${tema}: menu mobile`);
  await page.keyboard.press('Enter');
  await nav.getByRole('link', { name: 'Cadastro', exact: true }).focus();
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { name: 'Cadastro', exact: true }).waitFor();
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  registrar(`PASS: ${tema}, Header mobile: Enter abre, Tab/Shift+Tab percorrem/ciclam, Escape fecha e devolve foco, navegação fecha painel.`);
}
