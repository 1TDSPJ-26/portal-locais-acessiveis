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

## O que não é bloqueio

- não ter começado a tarefa;
- não ter lido a Issue;
- avisar somente depois do prazo;
- dificuldade comum ainda não investigada;
- depender de trabalho que já estava disponível;
- falta de organização sem comunicação prévia.

Um bloqueio aceito gera replanejamento. Ele não produz nota integral automática.

