import assert from "node:assert/strict";
import { test } from "node:test";
import { getMensagemErro } from "../src/utils/mensagens-erro.ts";

test("dados-invalidos retorna título e texto sem termos técnicos", () => {
  const { titulo, texto } = getMensagemErro("dados-invalidos");

  assert.ok(titulo.length > 0, "título não pode ser vazio");
  assert.ok(texto.length > 0, "texto não pode ser vazio");
  assert.ok(!texto.includes("JSON"), "não deve mencionar JSON");
  assert.ok(!texto.includes("localStorage"), "não deve mencionar localStorage");
});

test("armazenamento-indisponivel retorna título e texto sem termos técnicos", () => {
  const { titulo, texto } = getMensagemErro("armazenamento-indisponivel");

  assert.ok(titulo.length > 0, "título não pode ser vazio");
  assert.ok(texto.length > 0, "texto não pode ser vazio");
  assert.ok(!texto.includes("JSON"), "não deve mencionar JSON");
  assert.ok(!texto.includes("localStorage"), "não deve mencionar localStorage");
});

test("desconhecido retorna título e texto sem termos técnicos", () => {
  const { titulo, texto } = getMensagemErro("desconhecido");

  assert.ok(titulo.length > 0, "título não pode ser vazio");
  assert.ok(texto.length > 0, "texto não pode ser vazio");
  assert.ok(!texto.includes("JSON"), "não deve mencionar JSON");
  assert.ok(!texto.includes("localStorage"), "não deve mencionar localStorage");
});

test("cada motivo gera uma mensagem diferente dos demais", () => {
  const motivos = /** @type {const} */ (["dados-invalidos", "armazenamento-indisponivel", "desconhecido"]);
  const mensagens = motivos.map(getMensagemErro);

  const titulos = mensagens.map((m) => m.titulo);
  const textos = mensagens.map((m) => m.texto);

  assert.equal(new Set(titulos).size, motivos.length, "títulos devem ser distintos");
  assert.equal(new Set(textos).size, motivos.length, "textos devem ser distintos");
});
