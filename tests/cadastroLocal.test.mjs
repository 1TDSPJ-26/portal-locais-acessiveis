import assert from "node:assert/strict";
import { test } from "node:test";
import { criarLocal, LocalDuplicadoError } from "../src/services/cadastroLocal.ts";

const dados = {
  nome: "Biblioteca Central",
  categoria: "Cultura",
  endereco: "Rua das Flores, 10",
  recursos: ["Piso tátil"],
};

test("gera o ID a partir do maior ID, mesmo com lacunas", () => {
  const locais = [
    { id: 2, ...dados, nome: "Outro local" },
    { id: 7, ...dados, nome: "Mais um local" },
  ];

  assert.equal(criarLocal(locais, dados).id, 8);
  assert.equal(locais.length, 2);
});

test("recusa nome e endereço iguais sem distinguir caixa ou acentos", () => {
  const locais = [
    { id: 1, ...dados, nome: "BIBLIOTÉCA CENTRAL", endereco: "RUA DAS FLÓRES, 10" },
  ];

  assert.throws(() => criarLocal(locais, dados), LocalDuplicadoError);
});

test("permite mesmo nome em outro endereço", () => {
  const locais = [{ id: 1, ...dados, endereco: "Rua das Flores, 11" }];

  assert.equal(criarLocal(locais, dados).id, 2);
});

test("não repete IDs em cadastros sucessivos", () => {
  const primeiro = criarLocal([], dados);
  const segundo = criarLocal([primeiro], { ...dados, nome: "Museu Central" });

  assert.equal(primeiro.id, 1);
  assert.equal(segundo.id, 2);
});

test("copia os recursos para não compartilhar o arranjo do formulário", () => {
  const local = criarLocal([], dados);

  assert.deepEqual(local.recursos, dados.recursos);
  assert.notEqual(local.recursos, dados.recursos);
});
