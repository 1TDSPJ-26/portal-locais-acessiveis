import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { transpileModule, JsxEmit, ModuleKind } from "typescript";

// Compila o componente real em memória, sem adicionar um runner ou dependências.
const fonte = readFileSync(new URL("../src/components/Mensagem/index.tsx", import.meta.url), "utf8");
const { outputText } = transpileModule(fonte, {
  compilerOptions: { jsx: JsxEmit.ReactJSX, module: ModuleKind.ESNext },
});
const codigo = outputText.replace(/from "([^"]+)"/g, (_, modulo) => `from ${JSON.stringify(import.meta.resolve(modulo))}`);
const { default: Mensagem } = await import(`data:text/javascript;base64,${Buffer.from(codigo).toString("base64")}`);
const renderizar = (props, conteudo) => renderToStaticMarkup(createElement(Mensagem, props, conteudo));

for (const [tipo, rotulo, role, prioridade] of [
  ["erro", "Erro", "alert", "assertive"],
  ["sucesso", "Sucesso", "status", "polite"],
  ["aviso", "Aviso", "status", "polite"],
]) {
  test(`Mensagem ${tipo} identifica o tipo por texto e usa anúncio ${prioridade}`, () => {
    const html = renderizar({ tipo }, "Texto original.");
    assert.match(html, new RegExp(`>${rotulo}:<`));
    assert.match(html, new RegExp(`role="${role}"`));
    assert.match(html, new RegExp(`aria-live="${prioridade}"`));
    assert.match(html, /aria-atomic="true"/);
    assert.match(html, /Texto original\./);
  });
}

test("erro de campo preserva id e texto, sem duplicar regiões vivas", () => {
  const html = renderizar({ tipo: "erro", variante: "campo", anunciar: false, id: "nome-erro" }, "Informe o nome do local.");
  assert.match(html, /id="nome-erro"/);
  assert.match(html, /mensagem--campo/);
  assert.match(html, /Erro:/);
  assert.match(html, /Informe o nome do local\./);
  assert.doesNotMatch(html, /role=|aria-live=|aria-atomic=/);
});

test("região vazia permanece montada sem rótulo, conteúdo ou painel visível", () => {
  const html = renderizar({ tipo: "sucesso" }, "");
  assert.match(html, /role="status"/);
  assert.match(html, />\s*<\/div>$/);
  assert.doesNotMatch(html, /Sucesso:|mensagem-tipo|mensagem-conteudo/);
});

test("fragmento vazio também mantém a região sem rótulo ou painel", () => {
  const html = renderizar({ tipo: "aviso" }, createElement(Fragment, null, false, null, ""));
  assert.match(html, />\s*<\/div>$/);
  assert.doesNotMatch(html, /Aviso:|mensagem-tipo|mensagem-conteudo/);
});

test("Mensagem aceita título, ações, foco e classes adicionais", () => {
  const html = renderizar({ tipo: "aviso", id: "reserva", tabIndex: -1, className: "mt-6" }, [
    createElement("h2", { key: "titulo" }, "Exibindo dados de reserva"),
    createElement("button", { key: "acao", type: "button" }, "Tentar novamente"),
  ]);
  assert.match(html, /id="reserva"/);
  assert.match(html, /tabindex="-1"/);
  assert.match(html, /mensagem--painel mt-6/);
  assert.match(html, /<h2>Exibindo dados de reserva<\/h2>/);
  assert.match(html, /<button type="button">Tentar novamente<\/button>/);
});
