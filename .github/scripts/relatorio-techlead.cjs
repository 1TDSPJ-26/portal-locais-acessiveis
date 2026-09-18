"use strict";

/**
 * Monta os indicadores do `docs/modelo-relatorio-tech-lead.md` a partir do que o
 * GitHub registra. Apenas as funções de cálculo ficam aqui, sem chamada de rede,
 * para que as regras possam ser testadas isoladamente.
 *
 * O relatório não substitui a análise do Tech Lead. Ele preenche a contagem, que
 * é trabalho mecânico, e deixa a leitura dos números para quem acompanha a turma.
 */

// Mantida em duplicidade com `higiene-pr.cjs` de propósito: os dois workflows
// são independentes, e um não deve deixar de funcionar porque o outro mudou.
const PALAVRAS_DE_FECHAMENTO = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi;

function issuesReferenciadas(corpo) {
  const semCodigo = String(corpo || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ");
  return [...new Set([...semCodigo.matchAll(PALAVRAS_DE_FECHAMENTO)].map((m) => Number(m[1])))];
}

function numeroDaBranch(nome) {
  const achado = String(nome || "").match(/(?:^|\/)(\d+)-/);
  return achado ? Number(achado[1]) : null;
}

/**
 * Reproduz a decisão de revisão do GitHub: vale a última manifestação de cada
 * revisor, e comentários não contam. Usar apenas a última review do Pull Request
 * inteiro classifica como pendente um Pull Request já aprovado, bastando que
 * alguém comente depois da aprovação.
 */
function decisaoDaRevisao(revisoes) {
  const porAutor = new Map();

  for (const r of revisoes || []) {
    if (r.estado !== "APPROVED" && r.estado !== "CHANGES_REQUESTED") continue;
    const anterior = porAutor.get(r.autor);
    if (!anterior || new Date(r.data) >= new Date(anterior.data)) porAutor.set(r.autor, r);
  }

  const decisoes = [...porAutor.values()].map((r) => r.estado);
  if (decisoes.includes("CHANGES_REQUESTED")) return "CHANGES_REQUESTED";
  if (decisoes.includes("APPROVED")) return "APPROVED";
  return null;
}

const SITUACOES = [
  "Pronta para iniciar",
  "Branch criada, sem commits",
  "Em desenvolvimento",
  "Em revisão",
  "Correção solicitada",
  "Aprovada, aguardando integração",
  "Bloqueada",
  "Sem responsável",
];

/**
 * Uma branch existir não significa que a demanda começou. Metade das branches
 * deste repositório não possui commit algum, e contá-las como andamento produz
 * um relatório que descreve trabalho inexistente.
 */
function situacaoDaIssue(issue, vinculos) {
  const { pullRequests = [], branches = [] } = vinculos || {};

  if ((issue.labels || []).some((l) => l === "bloqueada")) return "Bloqueada";

  const abertos = pullRequests.filter((p) => p.estado === "OPEN");
  if (abertos.some((p) => p.revisao === "CHANGES_REQUESTED")) return "Correção solicitada";
  if (abertos.some((p) => p.revisao === "APPROVED")) return "Aprovada, aguardando integração";
  if (abertos.length > 0) return "Em revisão";

  if (branches.some((b) => b.commitsAFrente > 0)) return "Em desenvolvimento";
  if (branches.length > 0) return "Branch criada, sem commits";

  return (issue.assignees || []).length > 0 ? "Pronta para iniciar" : "Sem responsável";
}

function vincular({ issues, pullRequests, branches }) {
  const porIssue = new Map();
  for (const issue of issues) porIssue.set(issue.numero, { pullRequests: [], branches: [] });

  for (const pr of pullRequests) {
    for (const numero of issuesReferenciadas(pr.corpo)) {
      if (porIssue.has(numero)) porIssue.get(numero).pullRequests.push(pr);
    }
  }

  for (const branch of branches) {
    const numero = numeroDaBranch(branch.nome);
    if (numero !== null && porIssue.has(numero)) porIssue.get(numero).branches.push(branch);
  }

  return porIssue;
}

function contarSituacoes(issues, vinculos) {
  const contagem = Object.fromEntries(SITUACOES.map((s) => [s, 0]));
  for (const issue of issues) {
    contagem[situacaoDaIssue(issue, vinculos.get(issue.numero))] += 1;
  }
  return contagem;
}

function dentroDaJanela(data, inicio) {
  return Boolean(data) && new Date(data) >= inicio;
}

function atividadePorPessoa({ issues, pullRequests, commits, inicio }) {
  const pessoas = new Map();
  const registrar = (login, campo) => {
    if (!login) return;
    if (!pessoas.has(login)) {
      pessoas.set(login, { login, atribuidas: 0, commits: 0, integrados: 0, abertos: 0, revisoes: 0 });
    }
    pessoas.get(login)[campo] += 1;
  };

  for (const issue of issues) {
    if (issue.estado === "OPEN") for (const a of issue.assignees || []) registrar(a, "atribuidas");
  }
  for (const pr of pullRequests) {
    if (pr.estado === "OPEN") registrar(pr.autor, "abertos");
    if (dentroDaJanela(pr.integradoEm, inicio)) registrar(pr.autor, "integrados");
    for (const r of pr.revisoes || []) {
      if (dentroDaJanela(r.data, inicio)) registrar(r.autor, "revisoes");
    }
  }
  for (const commit of commits) {
    if (dentroDaJanela(commit.data, inicio)) registrar(commit.autor, "commits");
  }

  return pessoas;
}

function temAtividade(p) {
  return p.commits > 0 || p.integrados > 0 || p.abertos > 0 || p.revisoes > 0;
}

/** Pontos que merecem decisão do Tech Lead, e não apenas contagem. */
function pontosDeAtencao({ issues, vinculos, pullRequests, agora }) {
  const pontos = [];

  for (const issue of issues) {
    const situacao = situacaoDaIssue(issue, vinculos.get(issue.numero));
    if (situacao === "Branch criada, sem commits") {
      pontos.push(`A Issue #${issue.numero} tem branch criada e nenhum commit.`);
    }
    if (situacao === "Bloqueada") {
      pontos.push(`A Issue #${issue.numero} está marcada como bloqueada.`);
    }
    if (situacao === "Correção solicitada") {
      pontos.push(`A Issue #${issue.numero} recebeu pedido de correção e aguarda o responsável.`);
    }
  }

  for (const pr of pullRequests) {
    if (pr.estado !== "OPEN") continue;
    const dias = Math.floor((agora - new Date(pr.criadoEm)) / 86400000);
    if (pr.revisao === "APPROVED") {
      pontos.push(`O Pull Request #${pr.numero} está aprovado há ${dias} dia(s) e ainda não foi integrado.`);
    } else if (dias >= 3) {
      pontos.push(`O Pull Request #${pr.numero} está aberto há ${dias} dia(s) sem aprovação.`);
    }
    if (pr.temVerificacao === false) {
      pontos.push(`O Pull Request #${pr.numero} não possui verificação automática registrada.`);
    }
  }

  return pontos;
}

module.exports = {
  SITUACOES,
  decisaoDaRevisao,
  issuesReferenciadas,
  numeroDaBranch,
  situacaoDaIssue,
  vincular,
  contarSituacoes,
  atividadePorPessoa,
  temAtividade,
  pontosDeAtencao,
};
