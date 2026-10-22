
import { test } from "node:test";
import assert from "node:assert/strict";

import {
    adicionarAoHistorico,
    carregarHistorico,
    salvarHistorico,
} from "../src/historicoBuscas.ts";

test("adiciona a pesquisa mais recente no início", () => {
    const resultado = adicionarAoHistorico(
    ["Python", "Java"],
    "SQL",
    );

    assert.deepEqual(resultado, ["SQL", "Python", "Java"]);
});

test("remove repetições ignorando maiúsculas e acentos", () => {
    const resultado = adicionarAoHistorico(
    ["São Paulo", "Python"],
    "sao paulo",
    );

    assert.deepEqual(resultado, ["sao paulo", "Python"]);
});

test("mantém no máximo cinco pesquisas", () => {
    const resultado = adicionarAoHistorico(
    ["A", "B", "C", "D", "E"],
    "Pesquisa F",
    );

    assert.equal(resultado.length, 5);
    assert.deepEqual(resultado, [
    "Pesquisa F",
    "A",
    "B",
    "C",
    "D",
    ]);
});

test("ignora termos com menos de dois caracteres", () => {
    const resultado = adicionarAoHistorico(["Python"], "a");

    assert.deepEqual(resultado, ["Python"]);
});

test("salva e carrega o histórico", () => {
    const armazenamento = new Map();

    globalThis.localStorage = {
    getItem: (chave) => armazenamento.get(chave) ?? null,
    setItem: (chave, valor) => armazenamento.set(chave, valor),
    };

    salvarHistorico(["SQL", "Python"]);

    assert.deepEqual(carregarHistorico(), ["SQL", "Python"]);

    delete globalThis.localStorage;
});

test("funciona quando localStorage está indisponível", () => {
    delete globalThis.localStorage;

    assert.deepEqual(carregarHistorico(), []);

    assert.doesNotThrow(() => {
    salvarHistorico(["Python"]);
    });
});
