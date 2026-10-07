import assert from "node:assert/strict";
import test from "node:test";

import { excluirLocal } from "../src/services/cadastroLocal.ts";

const biblioteca = {
  id: 8,
  nome: "Biblioteca Central",
  categoria: "Cultura",
  endereco: "Rua Principal, 100",
  recursos: ["Entrada sem degraus"],
};

const museu = {
  ...biblioteca,
  id: 2,
  nome: "Museu Municipal",
  endereco: "Rua Secundária, 200",
};

test("exclui pelo identificador mesmo com IDs fora de ordem e com lacunas", () => {
  assert.deepEqual(excluirLocal([biblioteca, museu], 2), [biblioteca]);
});

test("não altera a lista original nem os locais restantes", () => {
  const locais = Object.freeze([
    Object.freeze(biblioteca),
    Object.freeze(museu),
  ]);

  const resultado = excluirLocal(locais, 8);

  assert.deepEqual(locais, [biblioteca, museu]);
  assert.deepEqual(resultado, [museu]);
  assert.notEqual(resultado, locais);
  assert.equal(resultado[0], museu);
});

test("preserva todos os locais quando o identificador não existe", () => {
  assert.deepEqual(excluirLocal([biblioteca, museu], 99), [biblioteca, museu]);
});

test("retorna uma lista vazia ao excluir o único local", () => {
  assert.deepEqual(excluirLocal([biblioteca], 8), []);
});

test("permite excluir de uma lista vazia", () => {
  assert.deepEqual(excluirLocal([], 8), []);
});
