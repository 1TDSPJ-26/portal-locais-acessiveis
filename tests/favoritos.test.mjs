import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import {
  CHAVE_FAVORITOS,
  alternarFavorito,
  carregarFavoritos,
  salvarFavoritos,
  validarFavoritos,
} from "../src/favoritos.ts";

const armazenamentoOriginal = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
let dados;
let armazenamento;

beforeEach(() => {
  dados = new Map();
  armazenamento = {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, String(valor)),
  };
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: armazenamento,
  });
});

afterEach(() => {
  if (armazenamentoOriginal) {
    Object.defineProperty(globalThis, "localStorage", armazenamentoOriginal);
  } else {
    delete globalThis.localStorage;
  }
});

test("inclui um favorito sem alterar a lista recebida", () => {
  const ids = Object.freeze([4, 1]);
  const resultado = alternarFavorito(ids, 8);
  assert.deepEqual(resultado, [4, 1, 8]);
  assert.deepEqual(ids, [4, 1]);
  assert.notEqual(resultado, ids);
});

test("remove pelo identificador e preserva a ordem dos demais favoritos", () => {
  const ids = Object.freeze([4, 1, 8]);
  const resultado = alternarFavorito(ids, 1);
  assert.deepEqual(resultado, [4, 8]);
  assert.deepEqual(ids, [4, 1, 8]);
  assert.notEqual(resultado, ids);
});

test("alternar duas vezes devolve os mesmos valores em uma lista nova", () => {
  const ids = Object.freeze([4, 1]);
  const resultado = alternarFavorito(alternarFavorito(ids, 8), 8);
  assert.deepEqual(resultado, ids);
  assert.notEqual(resultado, ids);
  assert.deepEqual(alternarFavorito([1], 1), []);
  assert.deepEqual(alternarFavorito([], 1), [1]);
});

test("não acrescenta identificadores que não são números inteiros", () => {
  const ids = Object.freeze([1]);
  for (const id of [1.5, NaN, Infinity, -Infinity, "2", undefined, null]) {
    assert.deepEqual(alternarFavorito(ids, id), [1]);
  }
});

test("validarFavoritos aceita inteiros únicos e devolve uma cópia", () => {
  const ids = Object.freeze([4, 0, -2, 1]);
  const resultado = validarFavoritos(ids);
  assert.deepEqual(resultado, ids);
  assert.notEqual(resultado, ids);
  assert.deepEqual(validarFavoritos([]), []);
});

test("validarFavoritos rejeita valores que não são listas", () => {
  for (const valor of [null, undefined, "[1]", 1, true, { ids: [1] }]) {
    assert.equal(validarFavoritos(valor), null);
  }
});

test("validarFavoritos rejeita toda a lista quando um item não é inteiro", () => {
  for (const id of ["2", 2.5, NaN, Infinity, -Infinity, null, undefined, true, {}, []]) {
    assert.equal(validarFavoritos([1, id]), null);
  }
  assert.equal(validarFavoritos(new Array(1)), null);
});

test("validarFavoritos rejeita repetição mesmo com outros IDs válidos", () => {
  assert.equal(validarFavoritos([1, 2, 1]), null);
  assert.equal(validarFavoritos([0, -0]), null);
});

test("carregarFavoritos começa vazio quando não existe conteúdo salvo", () => {
  assert.deepEqual(carregarFavoritos(), []);
  assert.equal(armazenamento.getItem(CHAVE_FAVORITOS), null);
});

test("carregarFavoritos recupera a lista válida e mantém sua ordem", () => {
  armazenamento.setItem(CHAVE_FAVORITOS, "[8,1,4]");
  assert.deepEqual(carregarFavoritos(), [8, 1, 4]);
  armazenamento.setItem(CHAVE_FAVORITOS, "[]");
  assert.deepEqual(carregarFavoritos(), []);
});

test("carregarFavoritos ignora JSON corrompido sem lançar erro", () => {
  for (const bruto of ["{inválido", "", "undefined", "[1,"]) {
    armazenamento.setItem(CHAVE_FAVORITOS, bruto);
    assert.deepEqual(carregarFavoritos(), []);
  }
});

test("carregarFavoritos ignora conteúdo com formato ou IDs inválidos", () => {
  for (const valor of [{ ids: [1] }, null, [1, "2"], [1.5], [1, 1]]) {
    armazenamento.setItem(CHAVE_FAVORITOS, JSON.stringify(valor));
    assert.deepEqual(carregarFavoritos(), []);
  }
});

test("carregarFavoritos funciona quando a leitura é bloqueada", () => {
  armazenamento.getItem = () => { throw new Error("Leitura bloqueada"); };
  assert.deepEqual(carregarFavoritos(), []);
});

test("leitura e gravação funcionam sem a API localStorage", () => {
  delete globalThis.localStorage;
  assert.deepEqual(carregarFavoritos(), []);
  assert.doesNotThrow(() => salvarFavoritos([1]));
});

test("leitura e gravação tratam o bloqueio do próprio acesso ao localStorage", () => {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    get() { throw new Error("Acesso bloqueado"); },
  });
  assert.deepEqual(carregarFavoritos(), []);
  assert.doesNotThrow(() => salvarFavoritos([1]));
});

test("salvarFavoritos grava na chave correta sem modificar outra lista", () => {
  const ids = Object.freeze([8, 1]);
  armazenamento.setItem("locais-cadastrados", "lista de locais");
  salvarFavoritos(ids);
  assert.equal(CHAVE_FAVORITOS, "locais-favoritos");
  assert.equal(armazenamento.getItem(CHAVE_FAVORITOS), "[8,1]");
  assert.equal(armazenamento.getItem("locais-cadastrados"), "lista de locais");
  assert.deepEqual(ids, [8, 1]);
  assert.deepEqual(carregarFavoritos(), ids);
});

test("salvarFavoritos grava a lista vazia depois de remover o último ID", () => {
  salvarFavoritos(alternarFavorito([1], 1));
  assert.equal(armazenamento.getItem(CHAVE_FAVORITOS), "[]");
  assert.deepEqual(carregarFavoritos(), []);
});

test("salvarFavoritos não lança quando a gravação falha por falta de espaço", () => {
  armazenamento.setItem = () => { throw new Error("QuotaExceededError"); };
  assert.doesNotThrow(() => salvarFavoritos([1]));
});

test("salvarFavoritos não substitui dados válidos por uma lista inválida", () => {
  salvarFavoritos([1]);
  for (const ids of [[2, 2], [2.5], ["2"]]) salvarFavoritos(ids);
  assert.deepEqual(carregarFavoritos(), [1]);
});
