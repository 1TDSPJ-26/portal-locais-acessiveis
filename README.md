# Pacote GitHub — CP Continuado

Este pacote contém modelos padronizados para o projeto continuado do Portal de Locais e Serviços Acessíveis.

## Conteúdo

```text
.github/
  ISSUE_TEMPLATE/
    feature.yml
    bug.yml
    test.yml
    documentation.yml
    config.yml
  workflows/
    ci.yml
  CODEOWNERS
  PULL_REQUEST_TEMPLATE.md

docs/
  configuracao-labels.md
  configuracao-project.md
  MENSAGEM_TEAMS.md
  modelo-bloqueio.md
  modelo-relatorio-qa.md
  modelo-relatorio-tech-lead.md
  modelo-release.md
  tutoriais/
    README.md
    01-primeiro-acesso.md
    02-issues-e-project.md
    03-dev-branch-commits-pr.md
    04-tech-lead-revisao-merge.md
    05-qa-testes.md
    06-ci-cd.md
    07-correcoes-conflitos-bloqueios.md
    08-release.md
    09-checklists-por-papel.md

.env.example
CONTRIBUTING.md
MANUAL_PROFESSOR.md
SETUP.md
vercel.json
```

## Siglas e termos

- CP: Check Point, ou momento formal de avaliação.
- QA: Quality Assurance, ou Garantia da Qualidade.
- DEV: Developer, ou Desenvolvedor.
- CI: Continuous Integration, ou Integração Contínua.
- Issue: registro formal de uma demanda.
- Pull Request: solicitação para revisar e integrar uma alteração.
- Git Flow: modelo de branches usado no projeto e extensão `git flow` que auxilia sua criação e publicação.
- Release: versão oficialmente liberada.
- Preview: publicação temporária utilizada para testes.

## Ordem de utilização

1. Abra `MANUAL_PROFESSOR.md`.
2. Confirme que o repositório da organização está público.
3. Crie a equipe `alunos` e conceda `Write` somente no repositório do projeto.
4. Crie as equipes `professores`, `tech-leads` e `qas`.
5. Copie este pacote para o repositório.
6. Crie `develop` e defina-a como branch padrão.
7. Confirme `git flow version` e execute `git flow init` em cada clone.
8. Substitua `ORGANIZACAO` no `CODEOWNERS`.
9. Crie labels e Milestones.
10. Confirme os modelos de Issue e Pull Request.
11. Execute o CI pela primeira vez.
12. Configure os Rulesets.
13. Crie o Project quando o serviço do GitHub estiver estável.
14. Confirme a aplicação Vite já criada na turma-piloto.
15. Execute o fluxo completo antes de repetir em outra organização.
16. Faça a publicação controlada pela Vercel CLI; não tente conectar diretamente o repositório da organização ao plano Hobby.

## Materiais por público

- Professor: `MANUAL_PROFESSOR.md` e `SETUP.md`.
- Todos os alunos: `docs/tutoriais/README.md`.
- DEV: tutoriais 1, 2, 3, 6, 7 e 9.
- Tech Lead: todos, com destaque para 4 e 8.
- QA: tutoriais 1, 2, 5, 6, 7, 8 e 9.

## O que não deve ser publicado

- RM;
- nota;
- justificativa médica;
- ocorrência disciplinar;
- senha;
- token;
- arquivo `.env`;
- dado médico ou pessoal sensível.

O controle de notas deverá permanecer em ambiente privado do professor.
