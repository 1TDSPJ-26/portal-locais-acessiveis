"use strict";

/**
 * Executa a conferência automática e registra o resultado como comentário único
 * no Pull Request. Usa apenas recursos nativos do Node, sem action de terceiros,
 * para que a verificação não dependa da versão de um pacote externo.
 */

const fs = require("node:fs");
const { analisar, montarComentario, issuesReferenciadas } = require("./higiene-pr.cjs");

const MARCADOR = "<!-- higiene-pr -->";
const API = "https://api.github.com";

const token = process.env.GITHUB_TOKEN;
const [dono, repositorio] = String(process.env.GITHUB_REPOSITORY || "").split("/");

async function chamar(caminho, opcoes = {}) {
  const resposta = await fetch(API + caminho, {
    ...opcoes,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
      "x-github-api-version": "2022-11-28",
      ...opcoes.headers,
    },
  });

  if (!resposta.ok && resposta.status !== 404) {
    const texto = await resposta.text();
    throw new Error(`${opcoes.method || "GET"} ${caminho} respondeu ${resposta.status}: ${texto}`);
  }

  return { status: resposta.status, corpo: await resposta.json().catch(() => null) };
}

async function consultarIssue(numero) {
  const { status, corpo } = await chamar(`/repos/${dono}/${repositorio}/issues/${numero}`);

  if (status === 404 || !corpo) return { numero, existe: false };

  return {
    numero,
    existe: true,
    estado: corpo.state,
    temMilestone: Boolean(corpo.milestone),
    ehPullRequest: Boolean(corpo.pull_request),
  };
}

async function publicarComentario(numeroDoPr, texto) {
  const { corpo: comentarios } = await chamar(
    `/repos/${dono}/${repositorio}/issues/${numeroDoPr}/comments?per_page=100`
  );

  const anterior = (comentarios || []).find((c) => (c.body || "").includes(MARCADOR));

  if (anterior) {
    await chamar(`/repos/${dono}/${repositorio}/issues/comments/${anterior.id}`, {
      method: "PATCH",
      body: JSON.stringify({ body: texto }),
    });
    return "atualizado";
  }

  await chamar(`/repos/${dono}/${repositorio}/issues/${numeroDoPr}/comments`, {
    method: "POST",
    body: JSON.stringify({ body: texto }),
  });
  return "criado";
}

async function principal() {
  const evento = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"));
  const pr = evento.pull_request;

  if (!pr) {
    console.log("Evento sem Pull Request. Nada a conferir.");
    return;
  }

  const referenciadas = issuesReferenciadas(pr.body);
  const issue = referenciadas.length > 0 ? await consultarIssue(referenciadas[0]) : null;

  const resultado = analisar({
    branch: pr.head.ref,
    corpo: pr.body,
    assignees: (pr.assignees || []).map((a) => a.login),
    issue,
  });

  const texto = montarComentario(resultado);
  const acao = await publicarComentario(pr.number, texto);
  console.log(`Comentário ${acao} no Pull Request #${pr.number}.`);

  for (const aviso of resultado.avisos) console.log(`::warning::${aviso}`);
  for (const erro of resultado.erros) console.log(`::error::${erro}`);

  if (resultado.erros.length > 0) {
    process.exitCode = 1;
  }
}

principal().catch((erro) => {
  console.log(`::error::A conferência automática falhou: ${erro.message}`);
  process.exitCode = 1;
});
