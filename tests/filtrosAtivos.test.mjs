import assert from "node:assert/strict";
import { test } from "node:test";
import {
  listarFiltrosAtivos,
  descreverFiltrosAtivos,
} from "../src/utils/filtros-ativos.ts";

test("lista os filtros ativos com tipo, valor e rótulo", () => {
  const params = new URLSearchParams(
    "busca=museu&categoria=Cultura&recurso=Libras&recurso=Piso+tátil&favoritos=1"
  );

  assert.deepEqual(listarFiltrosAtivos(params), [
    { tipo: "busca", valor: "museu", rotulo: "Busca: “museu”" },
    { tipo: "categoria", valor: "Cultura", rotulo: "Cultura" },
    { tipo: "recurso", valor: "Libras", rotulo: "Libras" },
    { tipo: "recurso", valor: "Piso tátil", rotulo: "Piso tátil" },
    { tipo: "favoritos", valor: "1", rotulo: "Somente favoritos" },
  ]);
});

test("ignora parâmetros vazios ou que não representam filtros válidos", () => {
  const params = new URLSearchParams(
    "busca=+++&categoria=Inexistente&recurso=Inexistente&favoritos=0"
  );

  assert.deepEqual(listarFiltrosAtivos(params), []);
});


test("descreve quando não existem filtros ativos", () => {
  assert.equal(descreverFiltrosAtivos([]), "Nenhum filtro ativo");
});

test("descreve um filtro ativo no singular", () => {
  const filtros = [
    { tipo: "categoria", valor: "Cultura", rotulo: "Cultura" },
  ];

  assert.equal(
    descreverFiltrosAtivos(filtros),
    "1 filtro ativo: categoria Cultura"
  );
});

test("descreve vários filtros ativos no plural", () => {
  const filtros = [
    { tipo: "categoria", valor: "Cultura", rotulo: "Cultura" },
    { tipo: "recurso", valor: "Libras", rotulo: "Libras" },
  ];

  assert.equal(
    descreverFiltrosAtivos(filtros),
    "2 filtros ativos: categoria Cultura e recurso Libras"
  );
});

