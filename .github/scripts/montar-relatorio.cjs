"use strict";

const {
  SITUACOES,
  situacaoDaIssue,
  contarSituacoes,
  temAtividade,
  pontosDeAtencao,
} = require("./relatorio-techlead.cjs");

const MARCADOR = "<!-- relatorio-techlead -->";

function data(iso) {
  return new Date(iso).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

function tabela(cabecalho, alinhamento, linhas) {
  return [
    `| ${cabecalho.join(" | ")} |`,
    `|${alinhamento.map((a) => (a === "d" ? "---:" : "---")).join("|")}|`,
    ...linhas.map((l) => `| ${l.join(" | ")} |`),
  ].join("\n");
}

function montar(dados) {
  const { issues, pullRequests, vinculos, pessoas, inicio, agora, commitsNaJanela } = dados;

  const abertas = issues.filter((i) => i.estado === "OPEN");
  const contagem = contarSituacoes(abertas, vinculos);
  const concluidas = issues.filter((i) => i.fechadaEm && new Date(i.fechadaEm) >= inicio);
  const integrados = pullRequests.filter((p) => p.integradoEm && new Date(p.integradoEm) >= inicio);

  const ativas = [...pessoas.values()].filter(temAtividade);
  const paradas = [...pessoas.values()].filter((p) => !temAtividade(p) && p.atribuidas > 0);

  const l = [];
  l.push(MARCADOR);
  l.push(`# Relatório do Tech Lead — ${data(inicio)} a ${data(agora)}`);
  l.push("");
  l.push(
    "Preenchido automaticamente a partir das Issues, dos Pull Requests e dos commits " +
      "do repositório. Os números são o ponto de partida da análise, não a análise."
  );
  l.push("");

  l.push("## Indicadores de acompanhamento");
  l.push("");
  l.push(
    tabela(
      ["Situação", "Quantidade"],
      ["t", "d"],
      SITUACOES.map((s) => [s, String(contagem[s])]).concat([
        ["**Total em aberto**", `**${abertas.length}**`],
      ])
    )
  );
  l.push("");

  l.push("## Entregas do período");
  l.push("");
  l.push(`- Issues concluídas: **${concluidas.length}**${concluidas.length ? " — " + concluidas.map((i) => "#" + i.numero).join(", ") : ""}`);
  l.push(`- Pull Requests integrados: **${integrados.length}**${integrados.length ? " — " + integrados.map((p) => "#" + p.numero).join(", ") : ""}`);
  l.push(`- Commits em \`develop\`: **${commitsNaJanela}**`);
  l.push("");

  l.push("## Situação de cada demanda em aberto");
  l.push("");
  l.push(
    tabela(
      ["Issue", "Situação", "Título"],
      ["t", "t", "t"],
      abertas
        .slice()
        .sort((a, b) => a.numero - b.numero)
        .map((i) => [`#${i.numero}`, situacaoDaIssue(i, vinculos.get(i.numero)), i.titulo])
    )
  );
  l.push("");

  l.push("## Distribuição do trabalho");
  l.push("");
  if (ativas.length === 0) {
    l.push("Nenhuma atividade registrada no período.");
  } else {
    l.push(
      tabela(
        ["Pessoa", "Issues atribuídas", "Commits", "PR integrados", "PR abertos", "Revisões"],
        ["t", "d", "d", "d", "d", "d"],
        ativas
          .sort((a, b) => b.commits - a.commits || a.login.localeCompare(b.login))
          .map((p) => [
            `@${p.login}`,
            String(p.atribuidas),
            String(p.commits),
            String(p.integrados),
            String(p.abertos),
            String(p.revisoes),
          ])
      )
    );
  }
  l.push("");

  l.push("## Sem atividade registrada no período");
  l.push("");
  if (paradas.length === 0) {
    l.push("Todas as pessoas com demanda atribuída registraram alguma atividade.");
  } else {
    l.push(
      `${paradas.length} pessoa(s) possuem demanda atribuída e nenhum commit, Pull Request ou revisão no período:`
    );
    l.push("");
    for (const p of paradas.sort((a, b) => a.login.localeCompare(b.login))) {
      l.push(`- @${p.login} — ${p.atribuidas} Issue(s) em aberto`);
    }
    l.push("");
    l.push(
      "> Ausência de registro não equivale a ausência de trabalho. Programação em par, " +
        "pesquisa, teste manual e apoio a colegas não aparecem aqui. A lista serve para " +
        "orientar a conversa, não para concluir nada sozinha."
    );
  }
  l.push("");

  const atencao = pontosDeAtencao({ issues: abertas, vinculos, pullRequests, agora });
  l.push("## Pontos que pedem decisão");
  l.push("");
  if (atencao.length === 0) {
    l.push("Nenhum ponto identificado automaticamente.");
  } else {
    for (const p of atencao) l.push(`- ${p}`);
  }
  l.push("");

  l.push("## A preencher pelo Tech Lead");
  l.push("");
  l.push("### Resumo executivo");
  l.push("");
  l.push("_Até cinco linhas sobre a situação geral._");
  l.push("");
  l.push("### Decisões e replanejamentos");
  l.push("");
  l.push("_Mudanças de responsável, prazo, escopo ou esforço._");
  l.push("");
  l.push("### Riscos para a Release");
  l.push("");
  l.push("_Risco, probabilidade, impacto, ação preventiva e responsável._");
  l.push("");
  l.push("### Plano da próxima semana");
  l.push("");
  l.push("_Objetivos acordados._");
  l.push("");
  l.push("---");
  l.push("");
  l.push(
    "O campo Squad, o Esforço e o Status do GitHub Project não constam deste " +
      "relatório, porque a automação não possui acesso ao Project. As contagens " +
      "derivam do estado das Issues, dos Pull Requests e das branches."
  );

  return l.join("\n");
}

module.exports = { montar, MARCADOR };
