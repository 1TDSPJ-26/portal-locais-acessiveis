import assert from "node:assert/strict";
import test from "node:test";
import { buscarLocalPorId } from "../src/utils/buscar-local-por-id.ts";
import { criarLocal } from "../src/services/cadastroLocal.ts";

const locais = [
  {
    id: 3,
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua Principal, 100",
    recursos: ["Entrada sem degraus"],
  },
  {
    id: 12,
    nome: "Parque Municipal",
    categoria: "Lazer",
    endereco: "Avenida Central, 200",
    recursos: [],
  },
];

test("encontra o local pelo ID numérico recebido como texto, sem usar a posição na lista", () => {
  assert.equal(buscarLocalPorId(locais, "3"), locais[0]);
  assert.equal(buscarLocalPorId(locais, "12"), locais[1]);
});

test("retorna undefined para identificador inexistente ou lista vazia", () => {
  assert.equal(buscarLocalPorId(locais, "99"), undefined);
  assert.equal(buscarLocalPorId([], "3"), undefined);
});

test("não converte identificadores inválidos ou parciais em IDs existentes", () => {
  for (const id of [undefined, "", "abc", "3abc", "3.0", " 3 ", "03", "NaN", "Infinity"]) {
    assert.equal(buscarLocalPorId(locais, id), undefined, `ID: ${id}`);
  }
});

test("encontra um local recém-cadastrado com todos os campos pelo ID gerado", () => {
  const novoLocal = criarLocal(locais, {
    nome: "Centro Cultural",
    categoria: "Cultura",
    endereco: "Rua das Flores, 300",
    recursos: ["Entrada sem degraus", "Libras"],
    descricao: "Espaço para exposições e oficinas.",
    email: "contato@exemplo.com",
    telefone: "11999999999",
    site: "exemplo.com",
  });
  const listaAtualizada = [...locais, novoLocal];

  assert.equal(novoLocal.id, 13);
  assert.equal(buscarLocalPorId(listaAtualizada, String(novoLocal.id)), novoLocal);
  assert.equal(buscarLocalPorId(locais, String(novoLocal.id)), undefined);
  assert.equal(listaAtualizada.length, 3);
});
