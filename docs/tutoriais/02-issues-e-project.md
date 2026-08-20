# Tutorial 2 — Issues e GitHub Project

## Objetivo

Aprender a registrar uma demanda e acompanhar seu estado sem depender de mensagens soltas.

## Quem cria cada tipo

| Tipo | Quem normalmente cria |
|---|---|
| Funcionalidade | Tech Lead após necessidade definida pelo professor |
| Defeito | QA, Tech Lead ou DEV que identificou o problema |
| Teste | QA |
| Documentação | responsável definido na demanda |

O professor pode criar ou alterar qualquer item quando precisar formalizar uma decisão acadêmica ou de produto.

## Passo 1 — abrir o formulário correto

1. Abra o repositório da turma.
2. Clique em **Issues**.
3. Clique em **New issue**.
4. Escolha o modelo correto.
5. Não utilize Issue em branco.

## Passo 2 — preencher o título

Use um resultado identificável.

Bom exemplo:

```text
[FEATURE] Exibir detalhes de um local acessível
```

Exemplo ruim:

```text
Fazer página
```

## Passo 3 — preencher o corpo

Descreva:

- contexto;
- objetivo;
- escopo;
- critérios de aceite;
- o que está fora do escopo;
- dependências;
- evidências esperadas.

Critérios de aceite precisam ser observáveis.

Exemplo:

```text
- [ ] Ao acessar /locais/42, o nome e o endereço do local são exibidos.
- [ ] Enquanto a API responde, uma mensagem de carregamento é apresentada.
- [ ] Se a API falhar, uma mensagem de erro é mostrada ao usuário.
- [ ] A página pode ser percorrida pelo teclado.
```

Evite frases como “funcionar corretamente” sem explicar o que deverá ser observado.

## Passo 4 — completar os metadados

Na lateral da Issue, confira:

1. **Assignees:** responsável principal;
2. **Labels:** tipo da demanda e situações especiais;
3. **Projects:** Project da turma;
4. **Milestone:** CP1, CP2 ou CP3;
5. campos do Project: Squad, Esforço, Prioridade, Data limite e QA responsável.

A Issue somente poderá ir para `Pronta para iniciar` quando todos esses dados estiverem completos.

## Passo 5 — mover no Project

Use os estados:

| Situação | Status |
|---|---|
| ainda precisa de detalhes | Em refinamento |
| possui todas as informações | Pronta para iniciar |
| DEV começou | Em desenvolvimento |
| Pull Request aberto | Em revisão técnica |
| revisão técnica aprovada | Em testes do QA |
| correção necessária | Correção solicitada |
| QA aprovou | Aprovada |
| merge concluído | Concluída |
| existe impedimento real | Bloqueada |

## Passo 6 — comentar de forma útil

Comentários devem registrar fatos e decisões.

Exemplo:

```text
Iniciei a implementação em 20/08, na branch feature/42-detalhe-local.
Dependência: endpoint GET /locais/:id.
Próxima atualização prevista: 21/08.
```

Não use apenas “estou fazendo”, “deu erro” ou “não consegui”.

## Passo 7 — relacionar o Pull Request

No corpo do Pull Request, use:

```text
Closes #42
```

Como `develop` é a branch padrão, a Issue será encerrada quando o Pull Request for integrado em `develop`.

## Checklist da Issue pronta

- [ ] Objetivo claro.
- [ ] Escopo definido.
- [ ] Critérios testáveis.
- [ ] Fora do escopo registrado.
- [ ] Responsável definido.
- [ ] QA definido.
- [ ] Squad definida.
- [ ] Esforço definido.
- [ ] Prazo definido.
- [ ] Milestone definido.
- [ ] Dependências registradas.

