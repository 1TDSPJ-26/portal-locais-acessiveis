# Tutorial 3 — DEV: branch, commits, push e Pull Request

## Objetivo

Executar uma demanda sem alterar diretamente `develop` ou `main`.

## Regra de início

Não comece apenas porque recebeu uma mensagem. Abra a Issue e confirme que ela está em `Pronta para iniciar`.

## Passo 1 — atualizar develop

No terminal:

```bash
git switch develop
git pull origin develop
```

Se o pull apresentar erro, não crie a branch até resolver ou pedir ajuda.

## Passo 2 — criar a branch da Issue

Para funcionalidade, correção comum, documentação, teste ou refatoração:

```bash
git flow feature start 42-detalhe-local
```

Exemplo de correção comum:

```bash
git flow feature start 57-corrige-mensagem-erro
```

O Git Flow cria a branch `feature/NUMERO-descricao` a partir de `develop` e já muda o terminal para ela. `hotfix` fica reservado para uma correção urgente do que já está em produção.

Use:

- letras minúsculas;
- hífens;
- número real da Issue;
- descrição curta.

## Passo 3 — registrar o início

Na Issue:

1. mova o Status para `Em desenvolvimento`;
2. comente o nome da branch;
3. registre qualquer dependência relevante.

## Passo 4 — desenvolver somente o escopo

Leia os critérios de aceite durante o desenvolvimento. Não misture outra funcionalidade na mesma branch.

Periodicamente, confira:

```bash
git status
git diff
```

`git status` mostra arquivos alterados. `git diff` mostra as alterações ainda não incluídas em um commit.

## Passo 5 — criar commits reais

Adicione apenas os arquivos relacionados:

```bash
git add src/pages/DetalheLocal.tsx
git add src/services/locais-service.ts
git commit -m "feat: exibe detalhes do local acessível"
```

Outros exemplos:

```text
fix: trata falha ao carregar detalhes do local
docs: documenta endpoint de consulta por id
test: adiciona cenário de local inexistente
refactor: separa consulta de local no service
```

Não faça commits vazios, artificiais ou com mensagens como `alteração`, `teste` e `final`.

## Passo 6 — testar localmente

Execute:

```bash
npm run lint
npm run build
npm run test --if-present
```

Depois, execute a aplicação e confira:

- caminho principal;
- pelo menos um erro aplicável;
- carregamento;
- navegação por teclado;
- foco e rótulos;
- responsividade;
- critérios de aceite.

## Passo 7 — atualizar a branch com develop

Ainda na branch da demanda:

```bash
git fetch origin
git merge origin/develop
```

Se aparecer conflito, use o tutorial de correções e conflitos. Não utilize force push.

Depois da atualização, execute lint e build novamente.

## Passo 8 — enviar a branch

```bash
git flow feature publish 42-detalhe-local
```

Esse primeiro envio publica `feature/42-detalhe-local` no GitHub. Nos próximos envios da mesma branch, basta:

```bash
git push
```

## Passo 9 — abrir o Pull Request

1. Abra o repositório no GitHub.
2. Clique em **Compare & pull request** ou em **Pull requests > New pull request**.
3. Confirme:
   - base: `develop`;
   - compare: sua branch.
4. Preencha o título.
5. Mantenha no corpo:

```text
Closes #42
```

6. Complete todo o template.
7. Explique como testar.
8. Inclua imagens ou link de evidência quando necessário.
9. Identifique sua autoria e colaboração.
10. Clique em **Create pull request**.

## Passo 10 — acompanhar CI e ambiente de teste

Após abrir o Pull Request:

1. aguarde o CI — Continuous Integration, ou Integração Contínua;
2. confirme que `lint-build-test` ficou verde;
3. abra o ambiente de teste indicado pelo professor, quando ele estiver disponível;
4. faça um teste rápido da alteração;
5. mova a Issue para `Em revisão técnica`;
6. solicite o Tech Lead como revisor.

## Passo 11 — responder às revisões

Se o Tech Lead ou o QA pedir correções:

1. não crie outro Pull Request;
2. continue na mesma branch;
3. faça as alterações;
4. crie novos commits;
5. execute lint e build;
6. envie com `git push`;
7. responda aos comentários;
8. solicite nova revisão.

## Passo 12 — limpar a branch local após o merge

Somente depois do merge:

```bash
git switch develop
git pull origin develop
git branch -d feature/42-detalhe-local
git fetch --prune
```

Não execute `git flow feature finish`. Esse comando faria o merge localmente. Neste projeto, o merge é realizado somente no Pull Request, depois do CI e das aprovações.

## Erros que invalidam o fluxo

- desenvolver sem Issue pronta;
- criar branch a partir de código desatualizado;
- fazer push direto em `develop` ou `main`;
- misturar várias demandas;
- esconder erro de lint ou build;
- abrir Pull Request para a branch errada;
- executar `git flow feature finish` e integrar localmente;
- aprovar ou integrar o próprio trabalho;
- apagar evidências para “limpar” o histórico.
