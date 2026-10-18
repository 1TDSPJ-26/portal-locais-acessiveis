import assert from "node:assert/strict";
import { test } from "node:test";
import { listarFiltrosAtivos } from "../src/utils/filtros-ativos.ts";

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
