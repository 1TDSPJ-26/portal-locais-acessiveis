# Tutorial 4 — Tech Lead: refinamento, revisão e merge

## Objetivo

Transformar necessidades em demandas executáveis, revisar a solução técnica e integrar somente o que foi aprovado.

## Parte A — refinar uma demanda

### Passo 1 — partir da necessidade aprovada

Confirme que a necessidade veio do professor, do backlog autorizado ou de um defeito validado.

### Passo 2 — escolher o formulário

1. Abra **Issues > New issue**.
2. Escolha funcionalidade, defeito ou documentação.
3. Preencha objetivo, escopo, fora do escopo, dependências e riscos.

### Passo 3 — escrever critérios verificáveis

Cada critério deve ter resposta objetiva: atendido ou não atendido.

Inclua quando aplicável:

- resultado principal;
- carregamento;
- erro;
- vazio;
- teclado e foco;
- responsividade;
- integração com API.

### Passo 4 — planejar

Defina:

- responsável;
- QA responsável;
- squad;
- esforço 1, 2, 3 ou 5;
- prioridade;
- data limite;
- Milestone;
- dependências.

Se a demanda superar 5 pontos de esforço, divida-a antes do desenvolvimento.

### Passo 5 — liberar

Mova a Issue de `Em refinamento` para `Pronta para iniciar` somente quando todos os campos estiverem completos e o conteúdo necessário já tiver sido apresentado ou autorizado.

## Parte B — realizar revisão técnica

### Passo 1 — conferir a relação com a Issue

No Pull Request, confirme:

- base `develop`;
- branch com número da Issue;
- `Closes #NUMERO`;
- escopo compatível;
- instruções de teste;
- autoria e evidências.

### Passo 2 — conferir o CI

O check `lint-build-test` deve estar verde. Se estiver vermelho, o Pull Request volta ao autor antes da revisão funcional.

### Passo 3 — revisar arquivos

1. Abra **Files changed**.
2. Leia os arquivos alterados.
3. Marque **Viewed** após conferir cada arquivo.
4. Observe:
   - tipagem;
   - legibilidade;
   - separação de responsabilidades;
   - tratamento de erros;
   - segurança;
   - acessibilidade;
   - alterações fora do escopo;
   - credenciais ou dados indevidos.

### Passo 4 — comentar no ponto correto

Clique na linha alterada e registre um comentário específico.

Bom exemplo:

```text
Este fetch precisa de tratamento para resposta não OK antes de converter o JSON. Inclua o cenário de erro previsto no critério 3.
```

Evite apenas “arrumar”, “está errado” ou “melhorar código”.

### Passo 5 — concluir a revisão

Use **Review changes** e escolha:

- **Approve:** tecnicamente pronto para QA;
- **Request changes:** há correções obrigatórias;
- **Comment:** observação sem bloquear.

Depois da aprovação técnica:

1. mova a Issue para `Em testes do QA`;
2. solicite o QA responsável;
3. não realize merge ainda.

## Parte C — realizar o merge

O merge só pode ocorrer quando:

- CI está verde;
- conversas estão resolvidas;
- Tech Lead aprovou tecnicamente;
- QA registrou resultado aprovado;
- o ambiente indicado pelo professor foi validado, quando disponível;
- não existe bloqueio aberto.

### Passo 1 — conferir a decisão do QA

Leia o relatório ou a Issue de teste. Não use apenas o selo visual de aprovação.

### Passo 2 — conferir alterações posteriores

Se o autor enviou commits depois das aprovações, exija nova revisão. Aprovação anterior não cobre código alterado depois.

### Passo 3 — integrar

1. Clique em **Merge pull request**.
2. Use **Create a merge commit**.
3. Confirme o merge.
4. Não utilize bypass sem autorização do professor.

### Passo 4 — verificar o fechamento

1. Confirme que a Issue foi encerrada.
2. Confirme Status `Concluída` no Project.
3. Confirme que a branch remota foi removida.
4. Se `Closes #NUMERO` não encerrou a Issue, relacione o Pull Request e encerre manualmente com justificativa.

## Tech Lead autor da demanda

O Tech Lead não pode aprovar o próprio trabalho. Outro Tech Lead ou revisor autorizado faz a revisão técnica, e o QA responsável executa a validação funcional.
