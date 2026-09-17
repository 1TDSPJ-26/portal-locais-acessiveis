"use strict";

/**
 * Coleta o estado do repositório e publica o relatório semanal como Issue.
 * Usa apenas recursos nativos do Node, sem action de terceiros.
 */

const { vincular, atividadePorPessoa, decisaoDaRevisao } = require("./relatorio-techlead.cjs");
const { montar} = require("./montar-relatorio.cjs");

const API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;
const [dono, repositorio] = String(process.env.GITHUB_REPOSITORY || "").split("/");
const DIAS = Number(process.env.JANELA_EM_DIAS || 7);

async function chamar(caminho) {
  const resposta = await fetch(API + caminho, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!resposta.ok) {
    throw new Error(`GET ${caminho} respondeu ${resposta.status}: ${await resposta.text()}`);
  }
  return resposta.json();
}

async function paginar(caminho) {
  const itens = [];
  for (let pagina = 1; pagina <= 10; pagina++) {
    const junta = caminho.includes("?") ? "&" : "?";
    const lote = await chamar(`${caminho}${junta}per_page=100&page=${pagina}`);
    itens.push(...lote);
    if (lote.length < 100) break;
  }
  return itens;
}

async function coletar() {
  const base = `/repos/${dono}/${repositorio}`;

  const brutas = await paginar(`${base}/issues?state=all&sort=updated`);
  const issues = brutas
    .filter((i) => !i.pull_request)
    .map((i) => ({
      numero: i.number,
      titulo: i.title,
      estado: i.state.toUpperCase(),
      labels: (i.labels || []).map((l) => (typeof l === "string" ? l : l.name)),
      assignees: (i.assignees || []).map((a) => a.login),
      fechadaEm: i.closed_at,
    }));

  const prBrutos = await paginar(`${base}/pulls?state=all&sort=updated`);
  const pullRequests = [];

  for (const p of prBrutos) {
    const revisoes = await chamar(`${base}/pulls/${p.number}/reviews?per_page=100`).catch(() => []);
    let temVerificacao = null;

    if (p.state === "open") {
      const checks = await chamar(`${base}/commits/${p.head.sha}/check-runs`).catch(() => null);
      temVerificacao = checks ? checks.total_count > 0 : null;
    }

    pullRequests.push({
      numero: p.number,
      estado: p.state.toUpperCase(),
      autor: p.user && p.user.login,
      corpo: p.body,
      criadoEm: p.created_at,
      integradoEm: p.merged_at,
      branch: p.head.ref,
      revisao: decisaoDaRevisao(
        revisoes.map((r) => ({ autor: r.user && r.user.login, data: r.submitted_at, estado: r.state }))
      ),
      revisoes: revisoes.map((r) => ({ autor: r.user && r.user.login, data: r.submitted_at })),
      temVerificacao,
    });
  }

  const nomes = await paginar(`${base}/branches`);
  const branches = [];
  for (const b of nomes) {
    if (b.name === "main" || b.name === "develop") continue;
    const comparacao = await chamar(
      `${base}/compare/develop...${encodeURIComponent(b.name)}`
    ).catch(() => null);
    branches.push({ nome: b.name, commitsAFrente: comparacao ? comparacao.ahead_by : 0 });
  }

  const inicio = new Date(Date.now() - DIAS * 86400000);
  const commitsBrutos = await paginar(
    `${base}/commits?sha=develop&since=${inicio.toISOString()}`
  ).catch(() => []);
  const commits = commitsBrutos.map((c) => ({
    autor: c.author ? c.author.login : c.commit.author.name,
    data: c.commit.author.date,
  }));

  return { issues, pullRequests, branches, commits, inicio };
}

async function publicar(titulo, corpo) {
  const base = `/repos/${dono}/${repositorio}`;
  const busca = new URLSearchParams({
    q: `repo:${dono}/${repositorio} is:issue in:title "${titulo}"`,
  });
  const achados = await chamar(`/search/issues?${busca}`).catch(() => ({ items: [] }));
  const existente = (achados.items || []).find((i) => i.title === titulo);

  const enviar = (caminho, metodo, dados) =>
    fetch(API + caminho, {
      method: metodo,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(dados),
    }).then(async (r) => {
      if (!r.ok) throw new Error(`${metodo} ${caminho} respondeu ${r.status}: ${await r.text()}`);
      return r.json();
    });

  if (existente) {
    await enviar(`${base}/issues/${existente.number}`, "PATCH", { body: corpo });
    return { acao: "atualizado", numero: existente.number };
  }

  const criada = await enviar(`${base}/issues`, "POST", {
    title: titulo,
    body: corpo,
    labels: ["tipo:documentacao"],
  });
  return { acao: "criado", numero: criada.number };
}

async function principal() {
  const dados = await coletar();
  const agora = new Date();

  const vinculos = vincular(dados);
  const pessoas = atividadePorPessoa({ ...dados, inicio: dados.inicio });

  const corpo = montar({
    ...dados,
    vinculos,
    pessoas,
    agora,
    commitsNaJanela: dados.commits.length,
  });

  const titulo = `Relatório do Tech Lead — semana de ${dados.inicio
    .toISOString()
    .slice(0, 10)}`;

  if (process.env.APENAS_IMPRIMIR === "1") {
    console.log(corpo);
    return;
  }

  const { acao, numero } = await publicar(titulo, corpo);
  console.log(`Relatório ${acao} na Issue #${numero}.`);
}

principal().catch((erro) => {
  console.log(`::error::A geração do relatório falhou: ${erro.message}`);
  process.exitCode = 1;
});
