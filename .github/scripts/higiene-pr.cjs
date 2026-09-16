"use strict";

/**
 * Confere automaticamente os itens do Tutorial 4, Parte B, Passo 1, que hoje o
 * Tech Lead verifica manualmente em cada Pull Request.
 *
 * Erro   = impede a revisão, porque quebra a rastreabilidade entre Issue e código.
 * Aviso  = registra a pendência sem bloquear o Pull Request.
 */

const PALAVRAS_DE_FECHAMENTO = /\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+#(\d+)/gi;

function numeroDaBranch(branch) {
  const encontrado = String(branch || "").match(/(?:^|\/)(\d+)-/);
  return encontrado ? Number(encontrado[1]) : null;
}

/**
 * Remove blocos e trechos de código antes da busca. O GitHub não encerra Issue
 * referenciada dentro de código, e considerar essas ocorrências faria a
 * conferência aprovar um Pull Request que, no merge, não fecha Issue alguma.
 */
function semTrechosDeCodigo(texto) {
  return String(texto || "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]*`/g, " ");
}

function issuesReferenciadas(corpo) {
  const achados = semTrechosDeCodigo(corpo).matchAll(PALAVRAS_DE_FECHAMENTO);
  return [...new Set([...achados].map((m) => Number(m[1])))];
}

function secoes(corpo) {
  const resultado = {};
  let atual = null;

  for (const linha of String(corpo || "").split("\n")) {
    // O Markdown admite até três espaços antes do `#`, e é comum o modelo do
    // repositório ser colado com recuo. Sem tolerar isso, toda seção preenchida
    // seria reportada como vazia.
    const titulo = linha.match(/^ {0,3}##\s+(.+?)\s*$/);
    if (titulo) {
      atual = titulo[1];
      resultado[atual] = [];
    } else if (atual) {
      resultado[atual].push(linha);
    }
  }

  for (const chave of Object.keys(resultado)) {
    resultado[chave] = resultado[chave].join("\n").trim();
  }
  return resultado;
}

/** Considera vazia a seção que só contém os marcadores do modelo. */
function estaVazia(texto) {
  if (!texto) return true;
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !/^[-*]$/.test(l) && !/^\d+\.$/.test(l))
    .join("").length === 0;
}

function analisar(dados) {
  const { branch, corpo, assignees = [], issue } = dados;
  const erros = [];
  const avisos = [];

  const referenciadas = issuesReferenciadas(corpo);
  const daBranch = numeroDaBranch(branch);

  if (referenciadas.length === 0) {
    erros.push(
      "O corpo não referencia Issue alguma. Inclua `Closes #NUMERO` para que a " +
        "Issue seja encerrada automaticamente no merge."
    );
  }

  if (issue && issue.existe === false) {
    erros.push(`A Issue #${issue.numero} referenciada não existe neste repositório.`);
  }

  if (issue && issue.existe && issue.ehPullRequest) {
    erros.push(
      `A referência \`#${issue.numero}\` aponta para um Pull Request, e não para uma Issue.`
    );
  }

  if (issue && issue.existe && issue.estado === "closed") {
    avisos.push(`A Issue #${issue.numero} já está fechada.`);
  }

  if (daBranch === null) {
    avisos.push(
      "A branch não contém o número da Issue. O `CONTRIBUTING.md`, na seção 3, " +
        "define o formato `feature/NUMERO-descricao-curta`."
    );
  } else if (referenciadas.length > 0 && !referenciadas.includes(daBranch)) {
    avisos.push(
      `A branch indica a Issue #${daBranch}, e o corpo referencia ` +
        `${referenciadas.map((n) => "#" + n).join(", ")}. Confirme qual é a correta.`
    );
  }

  if (assignees.length === 0) {
    avisos.push("O Pull Request está sem responsável. Defina ao menos um *assignee*.");
  }

  if (issue && issue.existe && !issue.temMilestone) {
    avisos.push(`A Issue #${issue.numero} está sem Milestone, então não pertence a nenhum CP.`);
  }

  const partes = secoes(corpo);
  for (const titulo of ["Resumo", "Como testar", "Evidências"]) {
    if (estaVazia(partes[titulo])) {
      avisos.push(`A seção **${titulo}** do modelo não foi preenchida.`);
    }
  }

  return { erros, avisos };
}

function montarComentario({ erros, avisos }) {
  const linhas = ["<!-- higiene-pr -->", "## Conferência automática do Pull Request", ""];

  if (erros.length === 0 && avisos.length === 0) {
    linhas.push("Nenhuma pendência encontrada. Os itens verificáveis do Tutorial 4 estão atendidos.");
    return linhas.join("\n");
  }

  if (erros.length > 0) {
    linhas.push("### Impedem a revisão", "");
    for (const e of erros) linhas.push(`- ${e}`);
    linhas.push("");
  }

  if (avisos.length > 0) {
    linhas.push("### Pendências que não bloqueiam", "");
    for (const a of avisos) linhas.push(`- ${a}`);
    linhas.push("");
  }

  linhas.push(
    "---",
    "Esta conferência cobre apenas o que pode ser verificado automaticamente. " +
      "A revisão de escopo, de código e de evidências continua sendo do Tech Lead."
  );
  return linhas.join("\n");
}

module.exports = {
  numeroDaBranch,
  semTrechosDeCodigo,
  issuesReferenciadas,
  secoes,
  estaVazia,
  analisar,
  montarComentario,
};
