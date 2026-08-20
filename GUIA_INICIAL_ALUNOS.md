# Guia inicial dos alunos

Este guia apresenta somente o que o aluno precisa fazer para preparar o projeto e trabalhar na primeira demanda.

## 1. Antes de começar

Confirme que você possui:

- conta no GitHub com o convite da organização aceito;
- acesso ao repositório da turma;
- Git instalado;
- extensão `git flow` instalada;
- Node.js instalado na versão indicada pelo professor;
- Visual Studio Code instalado.

No terminal, execute:

```bash
git --version
git flow version
node --version
npm --version
```

Todos os comandos devem apresentar uma versão. Se algum comando não for reconhecido, avise o professor antes de continuar.

## 2. Configurar sua identificação no Git

Esta configuração é feita apenas uma vez no computador:

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email-do-github@exemplo.com"
```

Utilize seu nome real e o mesmo e-mail associado à sua conta do GitHub.

## 3. Clonar o repositório da turma

1. Abra o repositório da turma no GitHub.
2. Clique em **Code**.
3. Selecione **HTTPS**.
4. Copie a URL.
5. No terminal, execute:

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DO_REPOSITORIO
```

Não execute `npm create vite@latest`. A aplicação-base já existe no repositório.

## 4. Inicializar o Git Flow

Dentro da pasta do projeto, execute:

```bash
git flow init
```

Quando o Git Flow fizer as perguntas:

1. confirme `main` como branch de produção;
2. confirme `develop` como branch de desenvolvimento;
3. pressione `Enter` para aceitar os demais prefixos sugeridos.

Essa configuração é realizada uma única vez em cada clone do projeto.

## 5. Preparar e testar a aplicação

Execute:

```bash
git switch develop
git pull origin develop
npm ci
npm run lint
npm run build
```

Se algum comando apresentar erro antes de você alterar o projeto, registre o erro e avise o Tech Lead — Líder Técnico — ou o professor.

## 6. Conferir a Issue antes de desenvolver

Issue é o registro da tarefa no GitHub.

Antes de começar, confirme se a Issue possui:

- descrição clara;
- critérios de aceite;
- responsável definido;
- Milestone — marco do CP — definido;
- Status `Pronta para iniciar`;
- número da Issue, por exemplo, `#42`.

Não comece uma tarefa que ainda não esteja pronta.

## 7. Criar a branch da Issue

Atualize `develop`:

```bash
git switch develop
git pull origin develop
```

Crie a branch com Git Flow:

```bash
git flow feature start 42-descricao-curta
```

Troque `42` pelo número real da Issue. O comando criará uma branch semelhante a:

```text
feature/42-descricao-curta
```

Na Issue:

1. altere o Status para `Em desenvolvimento`;
2. comente o nome da branch criada.

## 8. Desenvolver e criar commits

Trabalhe somente no que foi solicitado pela Issue.

Confira suas alterações:

```bash
git status
git diff
```

Crie commits com mensagens claras:

```bash
git add .
git commit -m "feat: implementa descrição da funcionalidade"
```

Outros exemplos:

```text
fix: corrige validação do formulário
docs: atualiza instruções do projeto
test: adiciona teste da listagem
refactor: reorganiza serviço da API
```

Não crie commits vazios e não utilize mensagens como `alteração`, `teste`, `pronto` ou `final`.

## 9. Testar antes de enviar

Execute:

```bash
npm run lint
npm run build
npm run test --if-present
```

Corrija os erros antes de publicar a branch.

## 10. Publicar a branch

No primeiro envio, execute:

```bash
git flow feature publish 42-descricao-curta
```

Nos próximos envios da mesma branch:

```bash
git push
```

## 11. Abrir o Pull Request

Pull Request, ou PR, é o pedido para revisar e integrar sua alteração.

No GitHub:

1. abra **Pull requests**;
2. clique em **New pull request**;
3. selecione `develop` em **base**;
4. selecione `feature/42-descricao-curta` em **compare**;
5. clique em **Create pull request**;
6. preencha todas as seções do modelo;
7. mantenha no texto:

```text
Closes #42
```

8. explique como testar;
9. clique em **Create pull request**.

## 12. Aguardar as verificações e revisões

Depois de abrir o Pull Request:

1. aguarde o CI — Integração Contínua — ficar verde;
2. aguarde a revisão do Tech Lead — Líder Técnico;
3. aguarde os testes do QA — Garantia da Qualidade;
4. faça as correções solicitadas na mesma branch;
5. utilize `git push` para enviar novos commits.

O aluno autor não deve aprovar nem realizar o merge do próprio Pull Request.

Não execute:

```bash
git flow feature finish 42-descricao-curta
```

O merge será realizado no GitHub pelo responsável, depois das verificações e aprovações.

## 13. Limpar a branch depois do merge

Somente depois que o Pull Request tiver sido integrado:

```bash
git switch develop
git pull origin develop
git branch -d feature/42-descricao-curta
git fetch --prune
```

## Checklist rápido

- [ ] Convite da organização aceito.
- [ ] Repositório clonado.
- [ ] Git Flow inicializado.
- [ ] Dependências instaladas com `npm ci`.
- [ ] `lint` e `build` funcionando.
- [ ] Issue conferida antes do desenvolvimento.
- [ ] Branch criada com `git flow feature start`.
- [ ] Commits claros e relacionados à Issue.
- [ ] Branch publicada com `git flow feature publish`.
- [ ] Pull Request aberto para `develop`.
- [ ] `Closes #NUMERO` incluído no Pull Request.
- [ ] CI, revisão técnica e QA aguardados.
- [ ] Nenhum `git flow feature finish` executado.
