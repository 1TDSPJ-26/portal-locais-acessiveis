# Configuração do GitHub Project

Crie um Project por turma a partir do mesmo modelo.

## Campos

| Campo | Tipo | Valores |
|---|---|---|
| Status | Seleção | Backlog, Em refinamento, Pronta para iniciar, Em desenvolvimento, Em revisão técnica, Em testes do QA, Correção solicitada, Aprovada, Concluída, Bloqueada |
| Squad | Seleção | Squad 1, Squad 2, Squad 3, Squad 4, Squad 5 |
| Tipo | Seleção | Funcionalidade, Defeito, Teste, Documentação, Infraestrutura, Acessibilidade |
| Esforço | Número | 1, 2, 3 ou 5 |
| Prioridade | Seleção | Crítica, Alta, Média, Baixa |
| Data de início | Data | Data planejada |
| Data limite | Data | Prazo aprovado |
| QA responsável | Texto | Usuário do QA |
| Resultado do QA | Seleção | Pendente, Aprovado, Ressalva, Reprovado, Bloqueado |
| Saúde da demanda | Seleção | Regular, Atenção, Em risco |
| Motivo do bloqueio | Texto | Resumo do impedimento |
| Iteração | Iteração | Semana acadêmica |

## Visualizações

1. Fluxo geral — quadro agrupado por Status.
2. Backlog — tabela ordenada por Prioridade e Data limite.
3. Por squad — quadro agrupado por Squad.
4. Meu trabalho — filtro `assignee:@me`.
5. Fila do QA — filtro do Status Em testes do QA.
6. Bloqueadas — filtro do Status Bloqueada.
7. CP atual — filtro pelo Milestone ativo.
8. Em risco — filtro da Saúde da demanda.
9. Release — itens aprovados, defeitos e bloqueios do CP.

## Automações iniciais

- Adicionar automaticamente novas Issues do repositório.
- Definir Status Backlog para item adicionado.
- Definir Status Concluída quando a Issue for encerrada.
- Reabrir o fluxo quando a Issue for reaberta.
- Não arquivar itens durante o semestre.

## Fonte oficial

| Informação | Origem |
|---|---|
| CP | Milestone |
| Responsável | Assignee |
| Situação | Status do Project |
| Esforço | Campo Esforço |
| Prazo | Campo Data limite |
| Requisitos | Corpo da Issue |
| Código | Pull Request |
| Testes | Issue ou relatório do QA |
| Nota | Controle privado do professor |

