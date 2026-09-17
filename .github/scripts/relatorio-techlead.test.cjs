"use strict";

const { test } = require("node:test");
const assert = require("node:assert");

const {
  situacaoDaIssue,
  vincular,
  contarSituacoes,
  atividadePorPessoa,
  temAtividade,
  pontosDeAtencao,
  decisaoDaRevisao,
  numeroDaBranch,
  issuesReferenciadas,
} = require("./relatorio-techlead.cjs");

const issue = (n, extra = {}) => ({
  numero: n,
  titulo: `Issue ${n}`,
  estado: "OPEN",
  labels: [],
  assignees: ["alguem"],
  ...extra,
});

test("branch sem commit não conta como demanda em andamento", () => {
  const s = situacaoDaIssue(issue(1), { branches: [{ nome: "feature/1-x", commitsAFrente: 0 }] });
  assert.equal(s, "Branch criada, sem commits");
});

test("branch com commit conta como em desenvolvimento", () => {
  const s = situacaoDaIssue(issue(1), { branches: [{ nome: "feature/1-x", commitsAFrente: 3 }] });
  assert.equal(s, "Em desenvolvimento");
});

test("Pull Request aberto tem precedência sobre a branch", () => {
  const s = situacaoDaIssue(issue(1), {
    branches: [{ nome: "feature/1-x", commitsAFrente: 3 }],
    pullRequests: [{ estado: "OPEN", revisao: null }],
  });
  assert.equal(s, "Em revisão");
});

test("distingue pedido de correção de aprovação pendente", () => {
  assert.equal(
    situacaoDaIssue(issue(1), { pullRequests: [{ estado: "OPEN", revisao: "CHANGES_REQUESTED" }] }),
    "Correção solicitada"
  );
  assert.equal(
    situacaoDaIssue(issue(1), { pullRequests: [{ estado: "OPEN", revisao: "APPROVED" }] }),
    "Aprovada, aguardando integração"
  );
});

test("a marcação de bloqueio prevalece sobre qualquer outro sinal", () => {
  const s = situacaoDaIssue(issue(1, { labels: ["bloqueada"] }), {
    pullRequests: [{ estado: "OPEN", revisao: "APPROVED" }],
  });
  assert.equal(s, "Bloqueada");
});

test("separa demanda sem responsável de demanda pronta para iniciar", () => {
  assert.equal(situacaoDaIssue(issue(1), {}), "Pronta para iniciar");
  assert.equal(situacaoDaIssue(issue(1, { assignees: [] }), {}), "Sem responsável");
});

test("Pull Request fechado sem integração não mantém a Issue em revisão", () => {
  const s = situacaoDaIssue(issue(1), { pullRequests: [{ estado: "CLOSED", revisao: null }] });
  assert.equal(s, "Pronta para iniciar");
});

test("vincula Pull Request e branch à Issue correspondente", () => {
  const v = vincular({
    issues: [issue(7), issue(9)],
    pullRequests: [{ numero: 70, corpo: "Closes #7", estado: "OPEN" }],
    branches: [{ nome: "feature/9-x", commitsAFrente: 1 }],
  });
  assert.equal(v.get(7).pullRequests.length, 1);
  assert.equal(v.get(9).branches.length, 1);
  assert.equal(v.get(7).branches.length, 0);
});

test("não vincula referência escrita dentro de trecho de código", () => {
  const v = vincular({
    issues: [issue(7)],
    pullRequests: [{ numero: 70, corpo: "exemplo: `Closes #7`", estado: "OPEN" }],
    branches: [],
  });
  assert.equal(v.get(7).pullRequests.length, 0);
});

test("a soma das situações corresponde ao total de Issues abertas", () => {
  const issues = [issue(1), issue(2, { assignees: [] }), issue(3, { labels: ["bloqueada"] })];
  const v = vincular({ issues, pullRequests: [], branches: [] });
  const c = contarSituacoes(issues, v);
  assert.equal(Object.values(c).reduce((a, b) => a + b, 0), 3);
});

test("contabiliza commit, integração, abertura e revisão por pessoa", () => {
  const inicio = new Date("2026-09-10T00:00:00Z");
  const p = atividadePorPessoa({
    issues: [issue(1, { assignees: ["ana"] })],
    pullRequests: [
      { numero: 1, estado: "OPEN", autor: "ana", revisoes: [{ autor: "bia", data: "2026-09-12T00:00:00Z" }] },
      { numero: 2, estado: "MERGED", autor: "bia", integradoEm: "2026-09-12T00:00:00Z", revisoes: [] },
    ],
    commits: [{ autor: "ana", data: "2026-09-12T00:00:00Z" }],
    inicio,
  });
  assert.equal(p.get("ana").atribuidas, 1);
  assert.equal(p.get("ana").commits, 1);
  assert.equal(p.get("ana").abertos, 1);
  assert.equal(p.get("bia").integrados, 1);
  assert.equal(p.get("bia").revisoes, 1);
});

test("desconsidera atividade anterior ao início do período", () => {
  const p = atividadePorPessoa({
    issues: [],
    pullRequests: [],
    commits: [{ autor: "ana", data: "2026-01-01T00:00:00Z" }],
    inicio: new Date("2026-09-10T00:00:00Z"),
  });
  // Quem só possui atividade fora da janela não entra no mapa. Isso evita que o
  // relatório liste pessoas que não participam mais do ciclo.
  assert.equal(p.has("ana"), false);
});

test("quem tem Issue atribuída e nenhuma atividade aparece sem registro de trabalho", () => {
  const p = atividadePorPessoa({
    issues: [issue(1, { assignees: ["ana"] })],
    pullRequests: [],
    commits: [{ autor: "ana", data: "2026-01-01T00:00:00Z" }],
    inicio: new Date("2026-09-10T00:00:00Z"),
  });
  assert.equal(p.get("ana").atribuidas, 1);
  assert.equal(temAtividade(p.get("ana")), false);
});

test("aponta Pull Request aprovado e ainda não integrado", () => {
  const pontos = pontosDeAtencao({
    issues: [],
    vinculos: new Map(),
    pullRequests: [
      { numero: 5, estado: "OPEN", revisao: "APPROVED", criadoEm: "2026-09-12T00:00:00Z", temVerificacao: true },
    ],
    agora: new Date("2026-09-16T00:00:00Z"),
  });
  assert.ok(pontos.some((p) => p.includes("#5") && p.includes("não foi integrado")));
});

test("aponta Pull Request sem verificação automática", () => {
  const pontos = pontosDeAtencao({
    issues: [],
    vinculos: new Map(),
    pullRequests: [
      { numero: 6, estado: "OPEN", revisao: null, criadoEm: "2026-09-16T00:00:00Z", temVerificacao: false },
    ],
    agora: new Date("2026-09-16T00:00:00Z"),
  });
  assert.ok(pontos.some((p) => p.includes("#6") && p.includes("verificação")));
});

test("não aponta Pull Request recente e sem pendência", () => {
  const pontos = pontosDeAtencao({
    issues: [],
    vinculos: new Map(),
    pullRequests: [
      { numero: 7, estado: "OPEN", revisao: null, criadoEm: "2026-09-16T00:00:00Z", temVerificacao: true },
    ],
    agora: new Date("2026-09-16T00:00:00Z"),
  });
  assert.deepEqual(pontos, []);
});

test("funções auxiliares de leitura de texto", () => {
  assert.equal(numeroDaBranch("feature/36-relatorio"), 36);
  assert.equal(numeroDaBranch("develop"), null);
  assert.deepEqual(issuesReferenciadas("Closes #36"), [36]);
});

test("comentário posterior não anula a aprovação já registrada", () => {
  const d = decisaoDaRevisao([
    { autor: "kkuras", data: "2026-09-16T20:57:00Z", estado: "APPROVED" },
    { autor: "brenoell", data: "2026-09-16T21:54:00Z", estado: "COMMENTED" },
  ]);
  assert.equal(d, "APPROVED");
});

test("pedido de correção de um revisor prevalece sobre a aprovação de outro", () => {
  const d = decisaoDaRevisao([
    { autor: "ana", data: "2026-09-15T00:00:00Z", estado: "APPROVED" },
    { autor: "bia", data: "2026-09-16T00:00:00Z", estado: "CHANGES_REQUESTED" },
  ]);
  assert.equal(d, "CHANGES_REQUESTED");
});

test("vale a última manifestação de cada revisor", () => {
  const d = decisaoDaRevisao([
    { autor: "ana", data: "2026-09-15T00:00:00Z", estado: "CHANGES_REQUESTED" },
    { autor: "ana", data: "2026-09-16T00:00:00Z", estado: "APPROVED" },
  ]);
  assert.equal(d, "APPROVED");
});

test("apenas comentários não produzem decisão", () => {
  assert.equal(decisaoDaRevisao([{ autor: "ana", data: "2026-09-16T00:00:00Z", estado: "COMMENTED" }]), null);
  assert.equal(decisaoDaRevisao([]), null);
});
