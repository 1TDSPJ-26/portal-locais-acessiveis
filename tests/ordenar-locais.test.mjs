import assert from "node:assert/strict";
import test from "node:test";

import { ordenarLocais } from "../src/utils/ordenar-locais.ts";

const criar = (id, nome, categoria) => ({
    id,
    nome,
    categoria,
    endereco: "Rua Teste, 1",
    recursos: [],
});

const locais = [
    criar(1, "Parque das Águas", "Lazer"),
    criar(2, "Ótica Visão", "Serviços"),
    criar(3, "café Aurora", "Alimentação"),
    criar(4, "Biblioteca Parque", "Cultura"),
    criar(5, "Orquestra Municipal", "Cultura"),
    criar(6, "Cine Horizonte", "Lazer"),
];

test("ordena por nome ignorando maiúsculas e acentos", () => {
    const nomes = ordenarLocais(locais, "nome").map((local) => local.nome);

    assert.deepEqual(nomes, [
        "Biblioteca Parque",
        "café Aurora",
        "Cine Horizonte",
        "Orquestra Municipal",
        "Ótica Visão",
        "Parque das Águas",
    ]);
});

test("ordena por categoria e, dentro dela, por nome", () => {
    const resultado = ordenarLocais(locais, "categoria").map(
        (local) => `${local.categoria}: ${local.nome}`,
    );

    assert.deepEqual(resultado, [
        "Alimentação: café Aurora",
        "Cultura: Biblioteca Parque",
        "Cultura: Orquestra Municipal",
        "Lazer: Cine Horizonte",
        "Lazer: Parque das Águas",
        "Serviços: Ótica Visão",
    ]);
});

test("não altera a lista original", () => {
    const copia = [...locais];

    const resultado = ordenarLocais(locais, "nome");

    assert.notEqual(resultado, locais);
    assert.deepEqual(locais, copia);
});

test("aceita lista vazia", () => {
    assert.deepEqual(ordenarLocais([], "nome"), []);
});