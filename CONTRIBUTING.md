# Guia de contribuição

Este documento define o fluxo obrigatório de trabalho do CP Continuado.

O projeto utiliza o modelo Git Flow e a extensão de linha de comando `git flow`.

## 0. Inicialize o Git Flow neste clone

Esta configuração é feita uma única vez em cada computador, depois do clone:

```bash
git flow version
git flow init
```

Durante o `git flow init`:

- confirme `main` como branch de produção;
- confirme `develop` como branch de desenvolvimento;
- aceite os prefixos padrão, inclusive `feature/`, `release/` e `hotfix/`.

## 1. Antes de desenvolver

Uma implementação só pode começar quando a Issue possuir:

- objetivo;
- escopo;
- critérios de aceite;
- responsável;
- QA responsável;
- esforço;
- data limite;
- Milestone;
- squad;
- conteúdo previamente apresentado ou autorizado.

Se faltar alguma informação, solicite o refinamento ao Tech Lead.

## 2. Atualize a branch `develop`

```bash
git switch develop
git pull origin develop
```

## 3. Crie a branch da demanda com Git Flow

Para funcionalidade, correção comum, documentação, teste ou refatoração:

```bash
git flow feature start 42-descricao-curta
```

O comando cria e seleciona a branch `feature/42-descricao-curta` a partir de `develop`.

Publique a branch pela primeira vez com:

```bash
git flow feature publish 42-descricao-curta
```

Uma correção urgente de algo que já está em produção usa `hotfix`, somente com autorização do professor:

```bash
git flow hotfix start 1.0.1
git flow hotfix publish 1.0.1
```

Utilize letras minúsculas, hífens e o número da Issue.

> Não execute `git flow feature finish`, `git flow release finish` nem `git flow hotfix finish`. Esses comandos fazem merges localmente. Neste projeto, todo merge deve ocorrer por Pull Request no GitHub, com CI e aprovações.

## 4. Desenvolva somente o escopo aprovado

- Não misture funcionalidades diferentes na mesma branch.
- Não altere critérios de aceite sem registro.
- Comunique bloqueios antes do prazo.
- Não envie credenciais.
- Não utilize `localStorage` como substituto da API do CRUD.

## 5. Commits

Mensagens recomendadas:

```text
feat: cria formulário de cadastro
fix: corrige validação do e-mail
docs: atualiza instruções da API
test: registra cenário de exclusão
refactor: reorganiza serviço de locais
chore: ajusta configuração do projeto
```

Significados:

- `feat`: nova funcionalidade;
- `fix`: correção;
- `docs`: documentação;
- `test`: testes;
- `refactor`: reorganização sem mudar o resultado esperado;
- `chore`: configuração ou manutenção técnica.

Não crie commits vazios ou artificiais para aumentar a quantidade.

## 6. Antes do Pull Request

```bash
npm run lint
npm run build
```

Depois, confira:

- critérios de aceite;
- estados de carregamento e erro;
- navegação por teclado;
- foco;
- rótulos;
- textos alternativos;
- responsividade aplicável;
- ausência de senhas e tokens.

## 7. Pull Request

O Pull Request deve:

- apontar para `develop`;
- utilizar o modelo oficial;
- conter `Closes #NUMERO`;
- explicar como testar;
- apresentar evidências;
- identificar colaboradores;
- aguardar revisão técnica;
- aguardar o QA.

## 8. Revisão e QA

O autor não pode aprovar ou integrar o próprio Pull Request.

Fluxo:

1. revisão técnica;
2. correções técnicas;
3. testes do QA;
4. correções funcionais;
5. reteste;
6. aprovação;
7. merge pelo Tech Lead.

## 9. Branches protegidas

É proibido enviar commits diretamente para:

```text
main
develop
release/**
```

Também é proibido:

- realizar `force push`;
- utilizar `git flow ... finish` para integrar localmente;
- apagar evidências;
- encerrar Issue sem integração;
- aprovar trabalho que não foi testado;
- incluir nota, RM ou justificativa médica no repositório.

## 10. Bloqueios

Utilize o modelo `docs/modelo-bloqueio.md` e registre:

- problema;
- tentativas;
- dependência;
- impacto;
- ajuda solicitada;
- próxima revisão.

Um bloqueio registrado antes do prazo poderá gerar replanejamento.
