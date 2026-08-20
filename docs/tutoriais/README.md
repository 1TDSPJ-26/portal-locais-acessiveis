# Tutoriais operacionais do CP Continuado

Use estes tutoriais na ordem indicada. Não pule etapas porque cada ação deixa evidências utilizadas no acompanhamento e na avaliação.

## Termos essenciais

- **Issue:** registro oficial de uma demanda, defeito, teste ou documento.
- **Branch:** linha de trabalho separada para uma demanda.
- **Commit:** registro identificado de uma alteração no código.
- **Push:** envio dos commits do computador para o GitHub.
- **PR — Pull Request:** pedido para revisar e integrar uma branch.
- **Review:** revisão registrada dentro do Pull Request.
- **Merge:** integração aprovada entre branches.
- **CI — Continuous Integration, ou Integração Contínua:** verificações automáticas de lint, build e testes.
- **CD — Continuous Deployment, ou Implantação Contínua:** publicação automática após uma alteração autorizada. Quando ainda não estiver habilitada, a publicação será controlada pelo professor.
- **Preview:** versão temporária da aplicação, quando um ambiente de teste tiver sido disponibilizado.
- **Release:** versão oficial do projeto entregue em um CP.

## Ordem recomendada

1. [Primeiro acesso, clone e execução](01-primeiro-acesso.md)
2. [Issues e GitHub Project](02-issues-e-project.md)
3. [DEV: branch, commits, push e Pull Request](03-dev-branch-commits-pr.md)
4. [Tech Lead: refinamento, revisão e merge](04-tech-lead-revisao-merge.md)
5. [QA: plano, execução, defeitos e decisão](05-qa-testes.md)
6. [CI e CD: entender os resultados automáticos](06-ci-cd.md)
7. [Correções, conflitos e bloqueios](07-correcoes-conflitos-bloqueios.md)
8. [Release do CP](08-release.md)
9. [Checklists rápidos por papel](09-checklists-por-papel.md)

## Regra central

Uma demanda deve deixar esta sequência de evidências:

```text
Issue → branch → commits → Pull Request → CI → revisão técnica → teste do QA → merge
```

Sem Issue, a responsabilidade não está formalmente definida. Sem Pull Request, a revisão e o teste não ficam rastreáveis. Sem CI verde, a alteração não está pronta para integração.

## Onde pedir ajuda

Registre a dúvida ou o bloqueio na própria Issue e mencione o Tech Lead. Não espere o prazo terminar para comunicar um impedimento.
