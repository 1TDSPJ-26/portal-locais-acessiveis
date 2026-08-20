# Configuração da turma-piloto — passo a passo do professor

Versão 4.1 — 18/08/2026

Este manual parte exatamente do cenário atual:

- cada turma já possui sua própria organização no GitHub;
- os alunos já são membros das organizações;
- o repositório será público;
- nesta primeira execução, somente uma turma será configurada;
- nessa turma, o repositório-modelo e a aplicação Vite + React + TypeScript já existem;
- as branches `develop` e `main` já foram criadas;
- nenhuma configuração deve ser replicada para as outras turmas antes do teste completo.

Substitua nos exemplos:

```text
ORGANIZACAO = nome real da organização da turma
REPOSITORIO = nome real do repositório
```

Exemplo:

```text
ORGANIZACAO = 1TDSPH-26
REPOSITORIO = portal-locais-acessiveis
```

## Glossário essencial

- **DEV — Developer, ou Desenvolvedor:** aluno que implementa a demanda.
- **QA — Quality Assurance, ou Garantia da Qualidade:** aluno que testa e registra a decisão.
- **Tech Lead — Líder Técnico:** aluno que refina demandas, revisa código e realiza a integração.
- **Issue:** registro de uma tarefa, defeito, teste ou documentação.
- **Pull Request, ou PR:** pedido para revisar e integrar uma alteração.
- **CI — Continuous Integration, ou Integração Contínua:** verificações automáticas de instalação, lint, build e testes.
- **CD — Continuous Deployment, ou Implantação Contínua:** publicação automática depois de uma alteração autorizada.
- **Ruleset:** conjunto de regras que protege uma branch.
- **Milestone:** marco usado para agrupar as Issues e os Pull Requests de um CP.
- **CODEOWNERS:** arquivo que informa quais equipes devem ser chamadas para revisar alterações.
- **Git Flow:** modelo de branches com `main`, `develop`, `feature`, `release` e `hotfix`.
- **`git flow`:** extensão de linha de comando que cria e publica essas branches seguindo o modelo Git Flow.
- **Deploy:** publicação da aplicação em um ambiente acessível pela internet.

---

# Mapa da implantação desta única turma

| Etapa | Situação | Ação |
|---|---|---|
| 1. Organização da turma | Concluída | Não criar outra organização |
| 2. Repositório público | Concluída | Somente conferir |
| 3. Permissões | Fazer agora | Criar equipes e conceder acesso |
| 4. Repositório-modelo | Já existe | Entender a finalidade; não replicar ainda |
| 5. Aplicação-base | Concluída | Não executar Vite novamente |
| 6. Branches | Concluída | Conferir `develop` e `main` |
| 7. CODEOWNERS | Fazer | Substituir o nome da organização |
| 8. Labels | Fazer | Criar nove labels |
| 9. Milestones | Fazer | Criar CP1, CP2 e CP3 |
| 10. Formulários | Fazer | Conferir os quatro formulários de Issue |
| 11. CI | Fazer | Executar e validar `lint-build-test` |
| 12. Proteção de `develop` | Fazer | Criar o primeiro Ruleset |
| 13. Proteção de `main` | Fazer | Criar o segundo Ruleset |
| 14. Project | Fazer | Criar apenas para esta turma |
| 15. Campos do Project | Fazer | Configurar os campos operacionais |
| 16. Visualizações | Fazer | Criar as visões da turma |
| 17. Automações | Fazer | Auto-adicionar Issues e atualizar Status |
| 18. Teste completo | Fazer | Testar com DEV, Tech Lead e QA reais |
| 19. Publicação | Aguardar decisão | Vercel Hobby não conecta diretamente ao repositório da organização |
| 20. Replicação | Não fazer agora | Somente depois de toda a turma-piloto funcionar |

---

# Etapa 1 — organização da turma

Esta etapa já está concluída.

Não crie uma organização geral e não mova os alunos. Continue trabalhando na organização da turma-piloto.

---

# Etapa 2 — conferir o repositório público

1. Abra o repositório da turma-piloto.
2. Observe a área ao lado do nome do repositório.
3. Confirme que aparece **Public**.
4. Se já estiver público, não altere nada.

Nunca publique:

- RM;
- notas;
- faltas;
- justificativas;
- e-mails particulares;
- senhas;
- tokens;
- arquivo `.env`;
- dados médicos ou pessoais sensíveis.

**Resultado esperado:** o repositório mostra a indicação **Public**.

---

# Etapa 3 — configurar as permissões do repositório

## 3.1. Modelo de permissão recomendado

Não conceda `Write` como permissão-base de toda a organização. Essa permissão atingiria todos os repositórios atuais e futuros da turma.

Use estas equipes:

| Equipe | Quem entra | Permissão no repositório |
|---|---|---|
| `alunos` | Todos os estudantes da turma | Write |
| `tech-leads` | Somente os Tech Leads | Maintain |
| `qas` | Somente os QAs | Write |
| `professores` | Professor e eventual responsável institucional | Admin |

`Write` permite criar branches, commits, Issues e Pull Requests. Os Rulesets impedirão alterações diretas em `develop` e `main`.

`Maintain` permite ao Tech Lead administrar o trabalho cotidiano sem receber poderes administrativos mais sensíveis.

`Admin` deve permanecer restrito ao professor.

## 3.2. Deixar a permissão-base sem escrita

Faça isto na organização da turma-piloto:

1. Abra a página inicial da organização.
2. Clique em **Settings**.
3. No menu lateral, abra **Member privileges**.
4. Localize **Base permissions**.
5. Selecione **No permission**.
6. Confirme a alteração.

Como o repositório é público, todos continuam conseguindo visualizá-lo. O direito de alterar o código será concedido pelas equipes.

## 3.3. Criar a equipe `alunos`

1. Volte à página principal da organização.
2. Clique em **Teams**.
3. Clique em **New team**.
4. Em **Team name**, digite `alunos`.
5. Em **Description**, digite `Alunos autorizados a contribuir no projeto da turma`.
6. Não escolha uma equipe-pai.
7. Em visibilidade, escolha **Visible**.
8. Clique em **Create team**.
9. Abra a aba **Members** da equipe.
10. Clique em **Add a member**.
11. Adicione os alunos da turma.

## 3.4. Criar as equipes de responsabilidade

Repita o processo anterior e crie:

```text
tech-leads
qas
professores
```

Regras importantes:

- use exatamente letras minúsculas e hífen em `tech-leads`;
- deixe as três equipes como **Visible**;
- inclua somente os alunos que realmente exercerão cada papel;
- inclua você na equipe `professores`.

Uma equipe usada no `CODEOWNERS` precisa estar visível e possuir acesso explícito de escrita ou superior no repositório.

## 3.5. Associar as equipes ao repositório

1. Abra o repositório da turma-piloto.
2. Clique em **Settings**.
3. No menu lateral, em **Access**, clique em **Collaborators & teams**.
4. Ao lado de **Manage access**, clique em **Add teams**.
5. Procure a equipe `alunos`.
6. Selecione a função **Write**.
7. Confirme em **Add alunos to this repository**.
8. Repita para `tech-leads` e selecione **Maintain**.
9. Repita para `qas` e selecione **Write**.
10. Repita para `professores` e selecione **Admin**.

## 3.6. Conferência da permissão

Na tela **Collaborators & teams**, confirme:

```text
alunos        Write
tech-leads    Maintain
qas           Write
professores   Admin
```

Não adicione os 35 alunos individualmente ao repositório. Controle-os pela equipe `alunos`.

**Pare aqui se alguma equipe não aparecer ou se você não conseguir alterar a permissão. Não avance para o CODEOWNERS antes de corrigir isso.**

---

# Etapa 4 — para que serve o repositório-modelo

Sim. O repositório-modelo servirá para gerar os repositórios iniciais das outras turmas.

Ele reaproveita:

- a aplicação-base;
- as pastas;
- os componentes iniciais;
- `.github/ISSUE_TEMPLATE`;
- modelo de Pull Request;
- `CODEOWNERS` com o marcador a ser substituído;
- workflow de CI;
- documentação;
- `vercel.json`;
- arquivos de configuração.

Ele não replica automaticamente:

- membros e equipes;
- permissões;
- labels personalizadas;
- Milestones;
- Rulesets;
- Project;
- segredos;
- ambientes;
- configuração de publicação.

Portanto, o template economiza a cópia dos arquivos, mas não substitui a configuração de cada organização.

## Decisão para a turma-piloto

O repositório que já existe será validado primeiro. Não clique em **Use this template** e não crie os repositórios das demais turmas agora.

## Atenção ao copiar no futuro

Ao criar os outros repositórios a partir do template, não marque **Include all branches**. O GitHub informa que branches incluídas por um template podem possuir históricos não relacionados, impedindo Pull Requests e merges entre elas.

O procedimento futuro será:

1. copiar somente a branch padrão `develop`;
2. criar `main` a partir da nova `develop` dentro do repositório gerado;
3. configurar as permissões, labels, Milestones, Rulesets e Project daquela organização.

Essa replicação só ocorrerá na Etapa 20.

---

# Etapa 5 — aplicação-base

Esta etapa já está concluída na turma-piloto.

Não execute novamente:

```bash
npm create vite@latest
```

Somente confira se existem:

```text
package.json
package-lock.json
src/
vite.config.*
tsconfig*.json
```

No computador, dentro do projeto, execute:

```bash
npm ci
npm run lint
npm run build
```

**Resultado esperado:** os três comandos terminam sem erro.

---

# Etapa 6 — conferir as branches e os merges

As branches já foram criadas. Faça apenas a conferência.

## 6.1. Conferir a branch padrão

1. Abra o repositório.
2. Clique em **Settings**.
3. No menu lateral, clique em **Branches**.
4. Em **Default branch**, confirme `develop`.
5. Se aparecer `main`, clique no botão de alteração, selecione `develop` e confirme.

## 6.2. Conferir as duas branches

1. Volte para a aba **Code**.
2. Abra o seletor de branch.
3. Confirme que aparecem:

```text
develop
main
```

## 6.3. Configurar a estratégia de merge

1. Abra **Settings**.
2. Em **General**, desça até **Pull Requests**.
3. Marque **Allow merge commits**.
4. Desmarque **Allow squash merging**.
5. Desmarque **Allow rebase merging**.
6. Marque **Automatically delete head branches**.

O merge commit deixa visível a integração da branch. A exclusão automática remove a branch temporária depois do merge, sem apagar o Pull Request nem seus commits.

**Resultado esperado:** `develop` é a branch padrão e `main` permanece reservada para produção.

## 6.4. Inicializar o Git Flow no clone usado no teste

No terminal, dentro do repositório:

```bash
git flow version
git flow init
```

Durante o `git flow init`:

1. confirme `main` como branch de produção;
2. confirme `develop` como branch de desenvolvimento;
3. pressione `Enter` para aceitar os prefixos padrão.

O `git flow init` grava uma configuração local. Por isso, cada aluno precisa executá-lo uma única vez depois de clonar o repositório.

Neste projeto, use os comandos `start` e `publish`, mas não use `finish`. Os comandos `git flow ... finish` fazem merges localmente; aqui todo merge deve passar por Pull Request, CI e aprovações no GitHub.

---

# Etapa 7 — configurar o CODEOWNERS

## 7.1. O que precisa ser gerado

Nada é gerado por uma tela do GitHub. O arquivo já foi fornecido no pacote:

```text
.github/CODEOWNERS
```

Você apenas substituirá o marcador `ORGANIZACAO` pelo nome real da organização da turma-piloto.

## 7.2. Abrir o arquivo na branch correta

1. Abra a aba **Code** do repositório.
2. No seletor de branch, escolha `develop`.
3. Abra a pasta `.github`.
4. Clique no arquivo `CODEOWNERS`.
5. Clique no ícone de lápis, **Edit this file**.

Se a pasta `.github` não aparecer, confirme se o pacote de configuração foi realmente enviado para a branch `develop`.

## 7.3. Substituir o nome

Localize:

```text
@ORGANIZACAO/tech-leads
@ORGANIZACAO/qas
@ORGANIZACAO/professores
```

Substitua `ORGANIZACAO` pelo nome exato. Exemplo:

```text
@1TDSPH-26/tech-leads
@1TDSPH-26/qas
@1TDSPH-26/professores
```

Não remova `@`, não coloque espaço e não use o nome do repositório.

O começo do arquivo ficará semelhante a:

```text
* @1TDSPH-26/tech-leads @1TDSPH-26/qas
/.github/ @1TDSPH-26/professores @1TDSPH-26/tech-leads
```

## 7.4. Salvar a alteração

Como os Rulesets ainda não foram ativados, esta é uma exceção de implantação:

1. clique em **Commit changes**;
2. use a mensagem `chore: configura responsáveis do codeowners`;
3. escolha **Commit directly to the develop branch**;
4. confirme em **Commit changes**.

Depois dos Rulesets, commits diretos em `develop` serão proibidos.

## 7.5. Validar o arquivo

1. Reabra `.github/CODEOWNERS` na branch `develop`.
2. Confira se os nomes das equipes aparecem como links.
3. Verifique se o GitHub não destaca nenhuma linha como inválida.

Se o nome não virar link, confira:

- o nome da organização;
- o slug da equipe;
- se a equipe está **Visible**;
- se a equipe possui acesso explícito `Write`, `Maintain` ou `Admin` ao repositório.

## Limite importante

Quando uma mesma linha possui dois proprietários, uma aprovação de qualquer um deles satisfaz a regra de aprovação por proprietário. Por isso, o Ruleset exigirá duas aprovações e o Tech Lead conferirá manualmente se houve uma aprovação técnica e uma do QA.

**Resultado esperado:** o arquivo não contém mais a palavra `ORGANIZACAO`.

---

# Etapa 8 — criar as labels

Label é uma etiqueta que classifica uma Issue ou um Pull Request.

As labels precisam existir antes do teste dos formulários, pois os formulários tentam aplicá-las automaticamente.

## 8.1. Abrir a tela

1. Abra o repositório da turma-piloto.
2. Clique em **Issues**.
3. Acima da lista, clique em **Labels**.
4. Clique em **New label**.

## 8.2. Criar cada label

Para cada linha da tabela:

1. preencha **Label name**;
2. preencha **Description**;
3. cole os seis caracteres em **Color**;
4. clique em **Create label**;
5. clique novamente em **New label** para criar a próxima.

| Label name | Description | Color |
|---|---|---|
| `tipo:feature` | Nova funcionalidade | `1D76DB` |
| `tipo:bug` | Defeito ou comportamento inesperado | `D73A4A` |
| `tipo:teste` | Planejamento ou resultado de teste | `5319E7` |
| `tipo:documentacao` | Criação ou atualização de documentação | `0075CA` |
| `tipo:infraestrutura` | Build, deploy ou configuração | `0E8A16` |
| `tipo:acessibilidade` | Auditoria ou correção de acessibilidade | `006B75` |
| `bloqueada` | Demanda impedida de avançar | `B60205` |
| `precisa-refinamento` | Issue ainda não está pronta para desenvolvimento | `FBCA04` |
| `release` | Item relacionado ao fechamento de um CP | `0052CC` |

Não é obrigatório apagar as labels padrão do GitHub agora.

## 8.3. Conferir

Use a pesquisa da tela de labels e confirme que os nove nomes aparecem exatamente como estão na tabela.

**Resultado esperado:** existem nove labels personalizadas e nenhuma possui erro de digitação.

---

# Etapa 9 — criar os Milestones

Milestone significa marco. Cada marco agrupará as Issues e os Pull Requests pertencentes a um CP.

## 9.1. Criar o CP1

1. Abra **Issues**.
2. Clique em **Milestones**.
3. Clique em **New milestone**.
4. Em **Title**, digite `CP1`.
5. Em **Due date**, selecione `11/09/2026`.
6. Em **Description**, cole:

```text
Entrega do CP1. Prazo final: 11/09/2026 às 23h59, horário de Brasília. Todas as Issues previstas para o CP1 devem estar associadas a este marco.
```

7. Clique em **Create milestone**.

## 9.2. Criar o CP2

Repita o processo com:

```text
Title: CP2
Due date: 02/10/2026
Description: Entrega do CP2. Prazo final: 02/10/2026 às 23h59, horário de Brasília. Todas as Issues previstas para o CP2 devem estar associadas a este marco.
```

## 9.3. Criar o CP3

Repita o processo com:

```text
Title: CP3
Due date: 23/10/2026
Description: Entrega final do CP3. Prazo final: 23/10/2026 às 23h59, horário de Brasília. Todas as Issues da publicação final devem estar associadas a este marco.
```

## 9.4. Conferir

Na tela **Milestones**, confirme:

| Milestone | Data limite |
|---|---|
| CP1 | 11/09/2026 |
| CP2 | 02/10/2026 |
| CP3 | 23/10/2026 |

**Resultado esperado:** três Milestones abertos e com datas corretas.

---

# Etapa 10 — conferir os formulários de Issue

## 10.1. Confirmar que Issues está habilitado

1. Abra **Settings** do repositório.
2. Em **General**, localize **Features**.
3. Confirme que **Issues** está marcado.

## 10.2. Confirmar os arquivos

Na branch `develop`, verifique a pasta:

```text
.github/ISSUE_TEMPLATE/
```

Ela deve conter:

```text
feature.yml
bug.yml
test.yml
documentation.yml
config.yml
```

Os formulários são lidos a partir da branch padrão. Por isso `develop` precisa continuar como padrão.

### Se a pasta `.github` não existir

Isso significa apenas que a aplicação Vite foi criada, mas os arquivos de configuração do GitHub ainda não foram copiados. O GitHub, o Vite e o comando `npm install` não criam esses arquivos automaticamente.

Use o pacote `arquivos-github-turma-piloto.zip`:

1. baixe e descompacte o arquivo;
2. localize a pasta `.github` extraída;
3. abra no VS Code a pasta principal da aplicação;
4. copie a pasta `.github` para a raiz da aplicação;
5. deixe-a no mesmo nível de `package.json`, `src` e `vite.config.ts`;
6. não coloque `.github` dentro de `src`, `public` ou outra pasta.

A estrutura correta será:

```text
REPOSITORIO/
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
  src/
  package.json
  package-lock.json
  vite.config.ts
```

Como os Rulesets ainda não foram ativados nesta etapa, envie a configuração diretamente para `develop`:

```bash
git switch develop
git pull origin develop
git status
git add .github
git commit -m "chore: adiciona configuracao do GitHub"
git push origin develop
```

Depois do push:

1. abra o repositório no GitHub;
2. selecione a branch `develop`;
3. confirme que `.github` aparece na raiz;
4. abra `.github/ISSUE_TEMPLATE`;
5. confirme os cinco arquivos.

Esta é uma exceção de implantação. Depois da criação dos Rulesets, alterações em `.github` também deverão passar por Pull Request.

## 10.3. Abrir a tela de criação

1. Clique em **Issues**.
2. Clique em **New issue**.
3. Confirme os quatro formulários:
   - Nova funcionalidade;
   - Relatar defeito;
   - Plano ou resultado de teste;
   - Documentação.

## 10.4. Criar a Issue usada no teste

1. Escolha **Documentação**.
2. Preencha o formulário com uma tarefa real e simples, por exemplo: melhorar a apresentação do projeto no `README.md`.
3. No painel lateral, associe:
   - um aluno DEV como **Assignee**;
   - o Milestone `CP1`;
   - a label automática `tipo:documentacao`.
4. Clique em **Submit new issue**.
5. Anote o número da Issue. Exemplo: `#1`.

Não encerre essa Issue. Ela será usada no teste do Pull Request.

**Resultado esperado:** a Issue foi criada pelo formulário, recebeu a label e pertence ao CP1.

---

# Etapa 11 — testar o Pull Request e executar o CI

Use a Issue criada na Etapa 10.

## 11.1. O DEV cria uma branch

No computador do aluno responsável:

```bash
git switch develop
git pull origin develop
git flow feature start NUMERO-atualizar-readme
```

Exemplo para a Issue 1:

```bash
git flow feature start 1-atualizar-readme
```

O aluno realiza a pequena alteração no `README.md` e executa:

```bash
git add README.md
git commit -m "docs: melhora apresentação do projeto"
git flow feature publish 1-atualizar-readme
```

## 11.2. Abrir o Pull Request

1. No GitHub, abra a aba **Pull requests**.
2. Clique em **New pull request**.
3. Em **base**, escolha `develop`.
4. Em **compare**, escolha `feature/1-atualizar-readme`.
5. Clique em **Create pull request**.
6. Confirme que o modelo de Pull Request apareceu.
7. Substitua:

```text
Closes #NUMERO_DA_ISSUE
```

por, por exemplo:

```text
Closes #1
```

8. Complete as demais seções.
9. Clique em **Create pull request**.

Não faça o merge ainda.

## 11.3. Conferir as solicitações do CODEOWNERS

No painel de revisores do Pull Request, confirme se foram solicitadas revisões para:

```text
tech-leads
qas
```

Se não aparecerem, volte à Etapa 7 e corrija o `CODEOWNERS` antes de seguir.

## 11.4. Conferir o CI

1. Aguarde a área de verificações do Pull Request.
2. Localize `lint-build-test`.
3. Clique em **Details**.
4. Confirme a execução de:
   - `npm ci`;
   - `npm run lint --if-present`;
   - `npm run build`;
   - `npm run test --if-present`.
5. Volte ao Pull Request.

O resultado precisa ficar verde.

## 11.5. Se o workflow não executar

1. Abra **Actions** no repositório.
2. Procure **Verificação de qualidade**.
3. Se aparecer um botão para habilitar workflows, clique em **I understand my workflows, go ahead and enable them**.
4. Se o workflow continuar bloqueado, abra **Settings > Actions > General**.
5. Confira as permissões de Actions da organização e do repositório.
6. Habilite as Actions oficiais utilizadas pelo projeto:
   - `actions/checkout`;
   - `actions/setup-node`.

## 11.6. Ponto de parada

Não configure o status obrigatório antes de `lint-build-test` ter executado pelo menos uma vez. O GitHub precisa conhecer o nome do check.

**Resultado esperado:** existe um Pull Request aberto para `develop`, o CODEOWNERS chamou as equipes e o CI ficou verde.

---

# Etapa 12 — proteger a branch develop

Agora será criado o primeiro Ruleset.

## 12.1. Abrir a criação

1. Abra o repositório.
2. Clique em **Settings**.
3. No menu lateral, em **Code and automation**, abra **Rules**.
4. Clique em **Rulesets**.
5. Clique em **New ruleset**.
6. Escolha **New branch ruleset**.

## 12.2. Identificação

1. Em **Ruleset name**, digite:

```text
Proteção develop
```

2. Em **Enforcement status**, selecione **Active**.

## 12.3. Bypass de emergência

Bypass significa permissão excepcional para ultrapassar uma regra.

1. Em **Bypass list**, clique em **Add bypass**.
2. Procure a equipe `professores`.
3. Adicione a equipe.
4. No tipo de bypass, selecione **For pull requests only**.

Isso mantém a exigência de abrir Pull Request, mesmo em uma emergência. Não adicione `alunos`, `tech-leads` ou `qas` ao bypass.

## 12.4. Definir a branch-alvo

1. Em **Target branches**, clique em **Add a target**.
2. Escolha **Include by pattern**.
3. Digite exatamente:

```text
develop
```

4. Confirme a inclusão.

## 12.5. Marcar as regras

Marque:

- **Restrict deletions**;
- **Require a pull request before merging**;
- **Require status checks to pass**;
- **Block force pushes**.

Dentro de **Require a pull request before merging**, configure:

1. **Required approvals:** `2`;
2. marque **Dismiss stale pull request approvals when new commits are pushed**;
3. marque **Require review from Code Owners**;
4. marque **Require conversation resolution before merging**;
5. deixe desmarcada a opção que permite ao autor aprovar o próprio trabalho, caso ela apareça.

## 12.6. Adicionar o CI obrigatório

1. Na regra **Require status checks to pass**, clique para adicionar um check.
2. Pesquise:

```text
lint-build-test
```

3. Selecione o check.
4. Confirme a inclusão no botão de adição mostrado pela tela.
5. Deixe desmarcado **Require branches to be up to date before merging**.

Não exigir atualização constante reduz conflitos em uma turma com muitos Pull Requests simultâneos.

## 12.7. O que não marcar

Deixe desmarcado:

- Require linear history;
- Require signed commits;
- Require deployments to succeed;
- Restrict creations;
- Restrict updates.

## 12.8. Criar e testar

1. Clique em **Create**.
2. Volte ao Pull Request aberto na Etapa 11.
3. Confirme que o merge está bloqueado aguardando duas aprovações.
4. Peça uma revisão de um Tech Lead.
5. Peça uma revisão de um QA.
6. Depois das duas aprovações e do CI verde, o Tech Lead realiza o merge.
7. Confirme que a branch temporária foi apagada automaticamente.
8. Confirme que a Issue foi fechada por causa de `Closes #NUMERO`.

O GitHub conta duas aprovações, mas não garante sozinho que elas vieram dos dois papéis corretos. Essa verificação continuará sendo responsabilidade do Tech Lead e do professor.

**Resultado esperado:** ninguém consegue alterar `develop` diretamente e o primeiro fluxo foi integrado por Pull Request.

---

# Etapa 13 — proteger a branch main

`main` representa produção e precisa de uma regra separada.

## 13.1. Criar o Ruleset

1. Abra **Settings > Rules > Rulesets**.
2. Clique em **New ruleset > New branch ruleset**.
3. Em **Ruleset name**, digite:

```text
Proteção main
```

4. Em **Enforcement status**, selecione **Active**.

## 13.2. Bypass

1. Em **Bypass list**, adicione somente `professores`.
2. Selecione **For pull requests only**.

## 13.3. Branch-alvo

1. Em **Target branches**, clique em **Add a target**.
2. Escolha **Include by pattern**.
3. Digite:

```text
main
```

4. Confirme.

## 13.4. Regras da main

Marque as mesmas proteções:

- Restrict deletions;
- Require a pull request before merging;
- Require status checks to pass;
- Block force pushes.

Configure:

```text
Required approvals: 2
Dismiss stale approvals: marcado
Require review from Code Owners: marcado
Require conversation resolution: marcado
Status check: lint-build-test
Require branches to be up to date: desmarcado
```

Clique em **Create**.

## 13.5. Regra humana da produção

Para um Pull Request destinado a `main`, as duas aprovações válidas serão:

1. uma aprovação do QA;
2. uma aprovação do professor.

O Tech Lead prepara e integra a Release somente após a autorização registrada pelo professor. O GitHub Free exige a quantidade de aprovações, mas não consegue garantir integralmente essa divisão por cargo. A conferência será processual.

Não teste a `main` com uma funcionalidade comum. Ela só receberá a primeira Release aprovada.

**Resultado esperado:** `main` não aceita commit direto e exige PR, CI e duas aprovações.

---

# Etapa 14 — criar o Project desta turma

Crie somente um Project na organização da turma-piloto.

## 14.1. Criar

1. Clique na sua foto no canto superior direito do GitHub.
2. Clique em **Your organizations** ou **Organizations**.
3. Abra a organização da turma-piloto.
4. Clique em **Projects**.
5. Clique em **New project**.
6. Em **Start from scratch**, escolha **Table**.
7. Em **Project name**, digite:

```text
CP Continuado 2026
```

8. Se a tela oferecer **Import items from repository**, escolha o repositório da turma-piloto.
9. Clique em **Create project**.

## 14.2. Configurar o acesso ao Project

1. Dentro do Project, clique no menu de três pontos no canto superior direito.
2. Clique em **Settings**.
3. Clique em **Manage access**.
4. Em **Base role**, escolha **Write**.

Essa permissão permite que todos os membros da organização movimentem cartões e preencham campos. Ela não altera a permissão do repositório.

Não escolha **Admin** como papel-base.

## 14.3. Definir o repositório padrão

Se o repositório não foi selecionado durante a criação:

1. abra **Settings** do Project;
2. localize a configuração de repositório padrão;
3. escolha o repositório da turma-piloto;
4. salve.

**Resultado esperado:** o Project pertence à organização da turma-piloto e os membros possuem `Write` somente nele.

---

# Etapa 15 — criar os campos do Project

## 15.1. Ajustar o campo Status

1. No Project, abra o menu de três pontos.
2. Clique em **Settings**.
3. Na lista de campos, clique em **Status**.
4. Renomeie ou crie as opções abaixo:

```text
Backlog
Em refinamento
Pronta para iniciar
Em desenvolvimento
Em revisão técnica
Em testes do QA
Correção solicitada
Aprovada
Concluída
Bloqueada
```

5. Defina `Backlog` como valor padrão, se a tela oferecer essa opção.
6. Salve.

## 15.2. Criar um campo de seleção

O procedimento será repetido várias vezes:

1. volte à visualização de tabela;
2. no cabeçalho da última coluna, clique em **+**;
3. clique em **New field**;
4. digite o nome;
5. selecione **Single select**;
6. adicione cada opção;
7. clique em **Save**.

## 15.3. Criar os campos de seleção

| Nome | Tipo | Opções |
|---|---|---|
| Squad | Single select | Squad 1, Squad 2, Squad 3, Squad 4, Squad 5 |
| Tipo | Single select | Funcionalidade, Defeito, Teste, Documentação, Infraestrutura, Acessibilidade |
| Prioridade | Single select | Crítica, Alta, Média, Baixa |
| Resultado do QA | Single select | Pendente, Aprovado, Ressalva, Reprovado, Bloqueado |
| Saúde da demanda | Single select | Regular, Atenção, Em risco |

## 15.4. Criar o campo Esforço

1. Clique em **+ > New field**.
2. Nome: `Esforço`.
3. Tipo: **Number**.
4. Clique em **Save**.

Os valores aceitos pelo processo serão `1`, `2`, `3` ou `5`.

## 15.5. Criar campos de texto

Repita **+ > New field** e escolha **Text**:

```text
QA responsável
Motivo do bloqueio
```

## 15.6. Criar campos de data

Repita **+ > New field** e escolha **Date**:

```text
Data de início
Data limite
```

## 15.7. Criar a Iteração

1. Clique em **+ > New field**.
2. Nome: `Iteração`.
3. Tipo: **Iteration**.
4. Duração: `1 week`.
5. Ajuste o início para a primeira semana letiva do projeto.
6. Clique em **Save**.

## 15.8. Conferir

Campos finais:

```text
Status
Squad
Tipo
Esforço
Prioridade
Data de início
Data limite
QA responsável
Resultado do QA
Saúde da demanda
Motivo do bloqueio
Iteração
```

**Resultado esperado:** os campos aparecem como colunas da tabela e podem ser preenchidos.

---

# Etapa 16 — criar as visualizações

Comece com quatro visualizações. As demais podem ser criadas depois que os alunos dominarem o fluxo.

## 16.1. Backlog

1. Abra a visualização de tabela existente.
2. Abra o menu **View** ao lado do campo de filtro.
3. Clique em **Rename view**.
4. Digite `Backlog`.
5. Exiba as colunas:
   - título;
   - assignee;
   - Status;
   - Prioridade;
   - Esforço;
   - Squad;
   - Data limite.
6. Ordene por Prioridade e Data limite.
7. Clique em **Save changes** no menu da visualização.

## 16.2. Fluxo geral

1. Clique em **New view**.
2. Abra o menu **View**.
3. Em **Layout**, escolha **Board**.
4. Em **Column field**, escolha **Status**.
5. Renomeie para `Fluxo geral`.
6. Salve as alterações.

## 16.3. Meu trabalho

1. Clique em **New view**.
2. Escolha **Table**.
3. No filtro, digite:

```text
assignee:@me
```

4. Renomeie para `Meu trabalho`.
5. Salve.

## 16.4. Fila do QA

1. Clique em **New view**.
2. Escolha **Table**.
3. No filtro, selecione o Status `Em testes do QA` ou digite o filtro sugerido pelo próprio GitHub.
4. Renomeie para `Fila do QA`.
5. Exiba `QA responsável` e `Resultado do QA`.
6. Salve.

## 16.5. Visualizações posteriores

Depois da turma dominar as quatro anteriores, acrescente:

- Bloqueadas;
- Por squad;
- CP atual;
- Em risco;
- Release.

Não monte todas no primeiro contato dos alunos.

**Resultado esperado:** há uma tabela de Backlog, um quadro por Status, uma visão pessoal e uma fila do QA.

---

# Etapa 17 — configurar automações do Project

Para evitar cartões duplicados, o Project rastreará automaticamente as Issues. O Pull Request continuará ligado à Issue como evidência de código.

## 17.1. Auto-adicionar novas Issues

1. Abra o Project.
2. Clique no menu de três pontos.
3. Clique em **Workflows**.
4. Na lista, escolha **Auto-add to project**.
5. Clique em **Edit**.
6. Selecione o repositório da turma-piloto.
7. No filtro, use:

```text
is:issue
```

8. Clique em **Save and turn on workflow**.

Essa automação vale para Issues criadas ou atualizadas depois de ser ativada. Ela não importa automaticamente todas as Issues antigas.

## 17.2. Definir Backlog ao adicionar

1. Ainda em **Workflows**, escolha **Item added to project**.
2. Clique em **Edit**, caso necessário.
3. Em **Set**, escolha:

```text
Status: Backlog
```

4. Ative o workflow.

## 17.3. Definir Concluída ao fechar

1. Abra o workflow **Item closed**.
2. Configure:

```text
Status: Concluída
```

3. Ative.

## 17.4. Testar

1. Crie uma nova Issue de teste no repositório.
2. Atualize a página do Project.
3. Confirme que a Issue apareceu com Status `Backlog`.
4. Feche a Issue.
5. Confirme que o Status mudou para `Concluída`.

**Resultado esperado:** novas Issues entram no Backlog e Issues fechadas ficam Concluídas.

---

# Etapa 18 — executar o teste completo da turma-piloto

Este teste deve utilizar pelo menos três contas diferentes:

- um DEV como autor;
- um Tech Lead como revisor técnico;
- um QA como revisor funcional.

O professor acompanha.

## 18.1. Preparar a Issue

1. Crie uma pequena Issue real.
2. Associe o Milestone `CP1`.
3. Defina Assignee, Squad, Tipo, Esforço, Prioridade e prazo.
4. Mova o Status para `Pronta para iniciar`.

## 18.2. Fluxo do DEV

1. Atualizar `develop` local.
2. Criar a branch com `git flow feature start NUMERO-descricao`.
3. Realizar a alteração.
4. Executar lint e build.
5. Fazer commits.
6. Publicar com `git flow feature publish NUMERO-descricao`.
7. Abrir Pull Request para `develop`.
8. Preencher `Closes #NUMERO`.

## 18.3. Fluxo do Tech Lead

1. Conferir escopo e arquivos.
2. Revisar o código.
3. Registrar comentário quando necessário.
4. Aprovar somente depois da correção.
5. Mover a Issue para `Em testes do QA`.

## 18.4. Fluxo do QA

1. Conferir os critérios de aceite.
2. Executar o caminho principal.
3. Executar pelo menos um cenário de erro.
4. Verificar teclado, foco, rótulos e mensagens aplicáveis.
5. Registrar evidências.
6. Aprovar ou solicitar correções.

## 18.5. Integração

Quando houver:

- CI verde;
- aprovação do Tech Lead;
- aprovação do QA;
- conversas resolvidas;

o Tech Lead realiza o merge em `develop`.

Depois, confirme:

- a Issue foi fechada;
- o Project mostra `Concluída`;
- a branch temporária foi apagada;
- o Pull Request continua disponível como evidência;
- os commits continuam no histórico.

Não execute `git flow feature finish` antes ou depois do Pull Request. Após o merge no GitHub, o DEV limpa a branch local:

```bash
git switch develop
git pull origin develop
git branch -d feature/NUMERO-descricao
git fetch --prune
```

**Não avance para as outras turmas enquanto qualquer item desse teste falhar.**

---

# Etapa 19 — publicação com Vercel

## Mudança importante em agosto de 2026

A documentação atual da Vercel informa que um projeto no plano Hobby não pode ser conectado diretamente a um repositório pertencente a uma organização Git. Portanto, o cenário abaixo não deve ser seguido:

```text
Organização GitHub pública -> Importar diretamente na Vercel Hobby
```

Manteremos:

- GitHub público dentro da organização da turma;
- Vercel Hobby sob controle do professor;
- deploy pela Vercel CLI, que funciona mesmo sem conexão Git;
- CI automático no GitHub;
- publicação controlada somente depois da Release.

Vercel CLI significa a ferramenta de linha de comando da Vercel.

## 19.1. Primeiro deploy manual controlado

No computador do professor:

```bash
git switch main
git pull origin main
npm ci
npm run lint
npm run build
npx vercel@latest login
npx vercel@latest
```

Durante as perguntas:

1. escolha sua conta pessoal Hobby;
2. confirme a criação de um novo projeto;
3. confirme a pasta atual como raiz;
4. confira se o framework detectado é Vite;
5. mantenha `npm run build` como comando de build;
6. mantenha `dist` como pasta de saída.

Depois do Preview funcionar, publique a Release:

```bash
npx vercel@latest --prod
```

Confira se `.vercel` está no `.gitignore`. A pasta `.vercel` contém a vinculação local e não deve ser versionada.

## 19.2. Teste da SPA

SPA significa **Single Page Application**, ou Aplicação de Página Única.

1. abra a página inicial publicada;
2. navegue até uma rota interna;
3. copie a URL da rota interna;
4. abra-a diretamente em uma nova aba;
5. confirme que não ocorre erro 404.

O arquivo `vercel.json` do pacote realiza a reescrita necessária para as rotas do React.

## 19.3. Sobre o CD automático

Não coloque um token pessoal da Vercel em um repositório no qual dezenas de alunos possuem `Write` sem antes configurar um ambiente protegido e aprovação obrigatória do professor.

A automatização segura da publicação será uma etapa separada, depois de:

- a turma-piloto concluir o fluxo GitHub;
- a conta Hobby e os limites serem confirmados;
- um ambiente `production` protegido ser criado;
- o professor controlar a liberação do segredo de produção.

Até lá, o projeto possui CI automático e deploy de produção manual controlado pelo professor. Não informe aos alunos que cada Pull Request gerará Preview automático na Vercel.

---

# Etapa 20 — transformar em template e replicar depois

Só faça esta etapa depois de todas as etapas anteriores funcionarem na turma-piloto.

## 20.1. Marcar como template

1. Abra o repositório validado.
2. Clique em **Settings**.
3. Em **General**, localize **Template repository**.
4. Marque a opção.

## 20.2. Criar o repositório da próxima turma

1. Volte à aba **Code** do template.
2. Clique em **Use this template**.
3. Clique em **Create a new repository**.
4. Em **Owner**, selecione a organização da próxima turma.
5. Digite o nome do repositório.
6. Escolha **Public**.
7. Não marque **Include all branches**.
8. Clique em **Create repository from template**.

## 20.3. Criar main a partir de develop

Como somente a branch padrão foi copiada, crie `main` a partir dela:

```bash
git clone URL_DO_NOVO_REPOSITORIO
cd NOME_DO_NOVO_REPOSITORIO
git switch develop
git switch -c main
git push -u origin main
git switch develop
```

## 20.4. O que precisa ser repetido na nova turma

Repita manualmente:

- Etapa 3: permissões e equipes;
- Etapa 7: nome da organização no CODEOWNERS;
- Etapa 8: labels;
- Etapa 9: Milestones;
- Etapas 12 e 13: Rulesets;
- Etapas 14 a 17: Project;
- Etapa 18: teste completo;
- Etapa 19: publicação.

Não assuma que o template copiou configurações administrativas.

---

# Checklist final da turma-piloto

- [ ] Repositório público.
- [ ] Permissão-base da organização sem escrita geral.
- [ ] Equipe `alunos` com Write.
- [ ] Equipe `tech-leads` com Maintain.
- [ ] Equipe `qas` com Write.
- [ ] Equipe `professores` com Admin.
- [ ] `develop` como branch padrão.
- [ ] `main` existente e reservada para produção.
- [ ] CODEOWNERS sem o marcador `ORGANIZACAO`.
- [ ] Nove labels personalizadas.
- [ ] Milestones CP1, CP2 e CP3.
- [ ] Quatro formulários de Issue.
- [ ] Modelo de Pull Request.
- [ ] CI `lint-build-test` verde.
- [ ] Ruleset de `develop` ativo.
- [ ] Ruleset de `main` ativo.
- [ ] Project com Base role Write.
- [ ] Campos configurados.
- [ ] Quatro visualizações iniciais.
- [ ] Automações básicas funcionando.
- [ ] Fluxo testado por DEV, Tech Lead e QA.
- [ ] Publicação controlada testada.
- [ ] Nenhuma outra turma replicada antes da validação.

---

# Referências oficiais

- Permissões no repositório: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository
- Permissão-base da organização: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization
- Equipes: https://docs.github.com/en/organizations/organizing-members-into-teams/creating-a-team
- CODEOWNERS: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners
- Labels: https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/managing-labels
- Milestones: https://docs.github.com/en/issues/using-labels-and-milestones-to-track-work/creating-and-editing-milestones-for-issues-and-pull-requests
- Rulesets: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository
- Regras disponíveis: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
- Criar Project: https://docs.github.com/en/issues/planning-and-tracking-with-projects/creating-projects/creating-a-project
- Acesso ao Project: https://docs.github.com/en/issues/planning-and-tracking-with-projects/managing-your-project/managing-access-to-your-projects
- Automações do Project: https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/adding-items-automatically
- Repositório template: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository
- Criar a partir de template: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template
- Limites da Vercel: https://vercel.com/docs/limits
- Vercel CLI: https://vercel.com/docs/cli
- Deploy sem conexão Git: https://vercel.com/docs/deployments
- Vite na Vercel: https://vercel.com/docs/frameworks/frontend/vite
