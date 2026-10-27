
import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAVE_FAVORITOS,
  alternarFavorito,
  validarFavoritos,
  carregarFavoritos,
  salvarFavoritos,
} from "../src/favoritos.ts";
import { filtrarLocais } from "../src/utils/filtrar-locais.ts";

function criarLocalStorageSimulado() {
  const dados = new Map();

  return {
    getItem(chave) {
      return dados.has(chave) ? dados.get(chave) : null;
    },
    setItem(chave, valor) {
      dados.set(chave, String(valor));
    },
    removeItem(chave) {
      dados.delete(chave);
    },
  };
}

const locais = [
  {
    id: 1,
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua Principal, 100",
    recursos: ["Libras"],
  },
  {
    id: 2,
    nome: "Parque Municipal",
    categoria: "Lazer",
    endereco: "Avenida Central, 200",
    recursos: ["Entrada sem degraus"],
  },
  {
    id: 3,
    nome: "Museu Acessível",
    categoria: "Cultura",
    endereco: "Rua das Flores, 300",
    recursos: ["Audiodescrição"],
  },
];

test("adiciona e remove favoritos com alternarFavorito", () => {
  assert.deepEqual(alternarFavorito([], 1), [1]);
  assert.deepEqual(alternarFavorito([1, 2], 1), [2]);
});

test("não duplica favoritos e ignora IDs não inteiros", () => {
  assert.deepEqual(alternarFavorito([1], 1), []);
  assert.deepEqual(alternarFavorito([1, 2], 1.5), [1, 2]);
  assert.deepEqual(alternarFavorito([1, 2], NaN), [1, 2]);
});

test("valida os dados antes de aceitá-los como favoritos", () => {
  assert.deepEqual(validarFavoritos([1, 2, 3]), [1, 2, 3]);
  assert.deepEqual(validarFavoritos([]), []);
  assert.equal(validarFavoritos(null), null);
  assert.equal(validarFavoritos("1,2"), null);
  assert.equal(validarFavoritos([1, "2"]), null);
  assert.equal(validarFavoritos([1, 1]), null);
  assert.equal(validarFavoritos([1, 2.5]), null);
});

test("salva e recupera favoritos do localStorage", () => {
  const armazenamentoOriginal = globalThis.localStorage;
  globalThis.localStorage = criarLocalStorageSimulado();

  try {
    salvarFavoritos([1, 3]);

    assert.equal(
      localStorage.getItem(CHAVE_FAVORITOS),
      "[1,3]",
    );
    assert.deepEqual(carregarFavoritos(), [1, 3]);
  } finally {
    if (armazenamentoOriginal === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = armazenamentoOriginal;
    }
  }
});

test("descarta JSON corrompido e estruturas inválidas salvas", () => {
  const armazenamentoOriginal = globalThis.localStorage;
  globalThis.localStorage = criarLocalStorageSimulado();

  try {
    localStorage.setItem(CHAVE_FAVORITOS, "{inválido");
    assert.deepEqual(carregarFavoritos(), []);

    localStorage.setItem(CHAVE_FAVORITOS, '{"id":1}');
    assert.deepEqual(carregarFavoritos(), []);

    localStorage.setItem(CHAVE_FAVORITOS, "[1,1]");
    assert.deepEqual(carregarFavoritos(), []);
  } finally {
    if (armazenamentoOriginal === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = armazenamentoOriginal;
    }
  }
});

test("não sobrescreve o armazenamento com uma lista inválida", () => {
  const armazenamentoOriginal = globalThis.localStorage;
  globalThis.localStorage = criarLocalStorageSimulado();

  try {
    salvarFavoritos([1]);
    salvarFavoritos([1, 1]);

    assert.deepEqual(carregarFavoritos(), [1]);
  } finally {
    if (armazenamentoOriginal === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = armazenamentoOriginal;
    }
  }
});

test("remove IDs de locais excluídos da lista de favoritos", () => {
  const favoritos = [1, 2, 99];
  const idsExistentes = new Set(locais.map((local) => local.id));

  const restantes = favoritos.filter((id) => idsExistentes.has(id));

  assert.deepEqual(restantes, [1, 2]);
});

test("o filtro de somente favoritos retorna apenas os locais favoritados", () => {
  const resultado = filtrarLocais(
    locais,
    "",
    {
      categoria: "",
      recursos: [],
      somenteFavoritos: true,
    },
    [1, 3],
  );

  assert.deepEqual(
    resultado.map((local) => local.id),
    [1, 3],
  );
});

test("combina favoritos com categoria e recursos de acessibilidade", () => {
  const resultado = filtrarLocais(
    locais,
    "",
    {
      categoria: "Cultura",
      recursos: ["Libras"],
      somenteFavoritos: true,
    },
    [1, 3],
  );

  assert.deepEqual(
    resultado.map((local) => local.id),
    [1],
  );
});

test("sem o filtro de favoritos, mantém os locais que atendem aos demais filtros", () => {
  const resultado = filtrarLocais(
    locais,
    "",
    {
      categoria: "",
      recursos: [],
      somenteFavoritos: false,
    },
    [],
  );

  assert.deepEqual(
    resultado.map((local) => local.id),
    [1, 2, 3],
  );
});
