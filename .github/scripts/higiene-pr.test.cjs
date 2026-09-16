"use strict";

const { test } = require("node:test");
const assert = require("node:assert");

const {
  numeroDaBranch,
  issuesReferenciadas,
  secoes,
  estaVazia,
  analisar,
} = require("./higiene-pr.cjs");

test("extrai o número da Issue a partir do nome da branch", () => {
  assert.equal(numeroDaBranch("feature/32-ci-verificacao"), 32);
  assert.equal(numeroDaBranch("15-estrutura-formulario"), 15);
  assert.equal(numeroDaBranch("feature/filtros-por-categoria"), null);
  assert.equal(numeroDaBranch("release/1.0"), null);
  assert.equal(numeroDaBranch("feature/rm571074"), null);
});

test("reconhece as palavras de fechamento aceitas pelo GitHub", () => {
  assert.deepEqual(issuesReferenciadas("Closes #12"), [12]);
  assert.deepEqual(issuesReferenciadas("Fixes #1 e Resolves #2"), [1, 2]);
  assert.deepEqual(issuesReferenciadas("closes #7"), [7]);
  assert.deepEqual(issuesReferenciadas("  Closes #17"), [17]);
});

test("não confunde menção solta nem o texto do modelo com fechamento", () => {
  assert.deepEqual(issuesReferenciadas("relacionado a #9"), []);
  assert.deepEqual(issuesReferenciadas("Closes #NUMERO_DA_ISSUE"), []);
});

test("não repete a mesma Issue referenciada duas vezes", () => {
  assert.deepEqual(issuesReferenciadas("Closes #5 e Closes #5"), [5]);
});

test("lê as seções mesmo quando o modelo é colado com recuo", () => {
  const partes = secoes("## Resumo\ntexto\n  ## Como testar\n\n## Evidências\n- imagem");
  assert.equal(partes["Resumo"], "texto");
  assert.equal(partes["Como testar"], "");
  assert.equal(partes["Evidências"], "- imagem");
});

test("considera vazia a seção que só tem os marcadores do modelo", () => {
  assert.equal(estaVazia(""), true);
  assert.equal(estaVazia("-\n-\n-"), true);
  assert.equal(estaVazia("1.\n2.\n3."), true);
  assert.equal(estaVazia("- fiz a alteração"), false);
});

test("impede a revisão quando não há referência a Issue", () => {
  const { erros } = analisar({ branch: "feature/9-x", corpo: "sem referência", assignees: ["a"] });
  assert.equal(erros.length, 1);
  assert.match(erros[0], /Closes/);
});

test("impede a revisão quando a Issue referenciada não existe", () => {
  const { erros } = analisar({
    branch: "feature/9-x",
    corpo: "Closes #999",
    assignees: ["a"],
    issue: { numero: 999, existe: false },
  });
  assert.match(erros[0], /não existe/);
});

test("impede a revisão quando a referência aponta para um Pull Request", () => {
  const { erros } = analisar({
    branch: "feature/9-x",
    corpo: "Closes #30",
    assignees: ["a"],
    issue: { numero: 30, existe: true, estado: "open", temMilestone: true, ehPullRequest: true },
  });
  assert.match(erros[0], /Pull Request, e não para uma Issue/);
});

test("avisa, sem bloquear, quando a branch e o corpo indicam Issues diferentes", () => {
  const { erros, avisos } = analisar({
    branch: "feature/9-x",
    corpo: "Closes #10",
    assignees: ["a"],
  });
  assert.equal(erros.length, 0);
  assert.ok(avisos.some((a) => a.includes("#9") && a.includes("#10")));
});

test("avisa quando o Pull Request está sem responsável", () => {
  const { avisos } = analisar({ branch: "feature/9-x", corpo: "Closes #9", assignees: [] });
  assert.ok(avisos.some((a) => a.includes("responsável")));
});

test("avisa uma vez para cada seção do modelo não preenchida", () => {
  const { avisos } = analisar({
    branch: "feature/9-x",
    corpo: "Closes #9\n\n## Resumo\n\n## Como testar\n\n## Evidências\n",
    assignees: ["a"],
  });
  assert.equal(avisos.filter((a) => a.includes("não foi preenchida")).length, 3);
});

test("não aponta pendência alguma em um Pull Request completo", () => {
  const { erros, avisos } = analisar({
    branch: "feature/32-ci",
    corpo: "Closes #32\n\n## Resumo\nAjuste do CI.\n\n## Como testar\n1. npm ci\n\n## Evidências\n- log",
    assignees: ["tiagostnz"],
    issue: { numero: 32, existe: true, estado: "open", temMilestone: true, ehPullRequest: false },
  });
  assert.deepEqual(erros, []);
  assert.deepEqual(avisos, []);
});
