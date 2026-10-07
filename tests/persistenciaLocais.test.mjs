import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import {
  CHAVE_LOCAIS,
  carregarLocaisSalvos,
  salvarLocais,
  validarLocais,
} from "../src/persistenciaLocais.ts";

const localValido = {
  id: 1,
  nome: "Biblioteca Parque",
  categoria: "Cultura",
  endereco: "Rua das Palmeiras, 120 · Centro",
  recursos: ["Entrada sem degraus", "Piso tátil"],
};

function montarArmazenamento(bloqueado = false) {
  const dados = new Map();
  return {
    getItem(chave) {
      if (bloqueado) throw new Error("armazenamento bloqueado");
      return dados.has(chave) ? dados.get(chave) : null;
    },
    setItem(chave, valor) {
      if (bloqueado) throw new Error("armazenamento bloqueado");
      dados.set(chave, String(valor));
    },
  };
}

let armazenamento;
beforeEach(() => {
  armazenamento = montarArmazenamento();
  globalThis.localStorage = armazenamento;
});

test("validarLocais aceita uma lista de locais válidos", () => {
  assert.deepEqual(validarLocais([localValido]), [localValido]);
});

test("validarLocais descarta o que não é lista", () => {
  assert.equal(validarLocais(null), null);
  assert.equal(validarLocais("locais"), null);
  assert.equal(validarLocais(localValido), null);
});

test("validarLocais descarta a lista inteira se um item for inválido", () => {
  const invalidoPorCategoria = { ...localValido, categoria: "Entretenimento" };
  const invalidoPorId = { ...localValido, id: "1" };
  const invalidoPorRecurso = { ...localValido, recursos: ["Elevador"] };

  assert.equal(validarLocais([localValido, invalidoPorCategoria]), null);
  assert.equal(validarLocais([invalidoPorId]), null);
  assert.equal(validarLocais([invalidoPorRecurso]), null);
});

test("carregarLocaisSalvos retorna null na primeira visita", () => {
  assert.equal(carregarLocaisSalvos(), null);
});

test("carregarLocaisSalvos retorna a lista gravada quando é válida", () => {
  const lista = [localValido];
  armazenamento.setItem(CHAVE_LOCAIS, JSON.stringify(lista));
  assert.deepEqual(carregarLocaisSalvos(), lista);
});

test("carregarLocaisSalvos retorna null com JSON corrompido", () => {
  armazenamento.setItem(CHAVE_LOCAIS, "{isso não é json");
  assert.equal(carregarLocaisSalvos(), null);
});

test("carregarLocaisSalvos retorna null com estrutura inválida gravada à mão", () => {
  armazenamento.setItem(CHAVE_LOCAIS, JSON.stringify({ nao: "sou lista" }));
  assert.equal(carregarLocaisSalvos(), null);
});

test("carregarLocaisSalvos retorna null com o armazenamento bloqueado", () => {
  globalThis.localStorage = montarArmazenamento(true);
  assert.equal(carregarLocaisSalvos(), null);
});

test("salvarLocais grava a lista no armazenamento", () => {
  const lista = [localValido];
  salvarLocais(lista);
  assert.deepEqual(JSON.parse(armazenamento.getItem(CHAVE_LOCAIS)), lista);
});

test("salvarLocais não lança com o armazenamento bloqueado", () => {
  globalThis.localStorage = montarArmazenamento(true);
  assert.doesNotThrow(() => salvarLocais([localValido]));
});