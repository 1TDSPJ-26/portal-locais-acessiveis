# Tutorial 7 — correções, conflitos e bloqueios

## Parte A — corrigir após uma revisão

Quando houver **Request changes**:

1. leia todos os comentários;
2. responda quando precisar confirmar entendimento;
3. permaneça na mesma branch;
4. altere somente o necessário;
5. execute lint, build e testes;
6. crie um commit de correção;
7. faça push;
8. responda ao comentário indicando o commit;
9. solicite nova revisão.

Exemplo:

```bash
git add src/pages/DetalheLocal.tsx
git commit -m "fix: trata local inexistente na página de detalhes"
git push
```

Não marque uma conversa como resolvida sem aplicar a correção ou registrar a decisão aceita.

## Parte B — atualizar a branch

Antes do Pull Request ou quando o Tech Lead solicitar:

```bash
git switch feature/42-detalhe-local
git fetch origin
git merge origin/develop
```

Se não houver conflito, teste e faça push.

## Parte C — resolver conflito simples

Quando o Git informar conflito:

1. execute `git status`;
2. abra cada arquivo indicado;
3. localize os marcadores:

```text
<<<<<<< HEAD
seu conteúdo
=======
conteúdo vindo de develop
>>>>>>> origin/develop
```

4. escolha ou combine o conteúdo correto;
5. remova todos os marcadores;
6. salve o arquivo;
7. execute lint e build;
8. adicione os arquivos resolvidos;
9. finalize o merge;
10. faça push.

```bash
git add ARQUIVOS_RESOLVIDOS
git commit -m "chore: resolve conflito com develop"
git push
```

Se não compreender as duas versões, não escolha aleatoriamente. Mencione o Tech Lead na Issue.

## Parte D — cancelar um merge ainda não concluído

Se percebeu que iniciou a atualização errada e ainda não criou o commit:

```bash
git merge --abort
```

Depois, peça orientação. Não utilize `git reset --hard` nem force push como tentativa de correção.

## Parte E — registrar um bloqueio

Bloqueio é um impedimento real que não pode ser resolvido apenas continuando a tarefa.

Na Issue, registre antes do prazo:

```text
Bloqueio: endpoint GET /locais/:id retorna erro 500.
Data e hora: 25/08/2026 às 20h15.
Tentativas: conferi URL, parâmetro e chamada no Postman.
Dependência: correção ou orientação da equipe de API.
Impacto: não consigo validar o estado de sucesso da página de detalhes.
Ajuda solicitada: @tech-lead e professor.
Próxima revisão: 26/08 às 18h.
```

Depois:

1. aplique a label `bloqueada`;
2. mude Status para `Bloqueada`;
3. preencha Saúde `Em risco`;
4. registre o motivo no Project;
5. mencione o responsável por ajudar.

## Parte F — erro no `npm ci` após atualizar a branch

Quando `develop` muda alguma dependência, o `package.json` e o
`package-lock.json` mudam juntos. Se a atualização da branch deixar um dos
dois na versão antiga, o `npm ci` recusa a instalação com uma mensagem como
esta:

```text
npm error `npm ci` can only install packages when your package.json and
package-lock.json or npm-shrinkwrap.json are in sync.
npm error Invalid: lock file's react-router@8.0.0 does not satisfy react-router@8.4.0
```

O mesmo vale para conflito de merge no `package-lock.json`. Esse arquivo é
gerado pelo npm: **não o edite à mão** nem escolha trechos dos dois lados.

### Se a sua Issue não alterou dependências

É o caso da maioria das Issues. Traga os dois arquivos exatamente como estão
em `develop`:

```bash
git fetch origin
git checkout origin/develop -- package.json package-lock.json
npm ci
npm run lint
npm run build
npm test
git add package.json package-lock.json
git commit -m "fix: sincroniza package.json e package-lock.json com develop"
git push
```

Se isso acontecer no meio de um merge com conflito, use o mesmo
`git checkout origin/develop -- ...`, resolva os demais arquivos e finalize o
merge com `git add` e `git commit`, como na Parte C.

### Se a sua Issue acrescentou uma dependência

Traga os dois arquivos de `develop`, como acima, e instale de novo apenas o
pacote da sua Issue. O npm regenera o `package-lock.json` de forma coerente:

```bash
git checkout origin/develop -- package.json package-lock.json
npm install NOME_DO_PACOTE
```

Uma Issue só deve acrescentar dependência com autorização do Tech Lead.

### Para evitar o problema

- instale com `npm ci`, não com `npm install`: o `npm ci` não altera o
  `package-lock.json`;
- não inclua no commit um `package-lock.json` alterado sem motivo;
- confira se o `node --version` mostra a versão indicada no `.nvmrc`
  (Node 22.22 ou mais recente).

Se o erro continuar depois desses passos, registre um bloqueio, como na
Parte E, colando a mensagem completa do terminal.

## O que não é bloqueio

- não ter começado a tarefa;
- não ter lido a Issue;
- avisar somente depois do prazo;
- dificuldade comum ainda não investigada;
- depender de trabalho que já estava disponível;
- falta de organização sem comunicação prévia.

Um bloqueio aceito gera replanejamento. Ele não produz nota integral automática.

