# Plano de integração do CP2

Responsável: @tiagostnz (Tech Lead) — Issue #59
Prazo do ciclo: 07/10/2026, 23h59

Este documento registra a ordem de integração das demandas do CP2, os
arquivos que várias delas alteram, as decisões técnicas tomadas durante o
ciclo, as revisões dos Pull Requests e a verificação final do fluxo em
`develop`.

## 1. Ondas de integração

A ordem foi derivada da seção "Dependências" de cada Issue. A regra principal
era: nenhuma demanda que altera a listagem parte antes da #69, que define qual
página é a listagem oficial.

| Onda | Issues | Motivo | Situação em 07/10 |
|---|---|---|---|
| 1 | #69, #80, #84 | definem a listagem oficial e o padrão visual usados pelas demais | #69 integrada em 06/10; #80 e #84 abertas |
| 2 | #66, #67, #68, #70, #79, #81, #82, #83, #86 | dependem apenas da onda 1 | integradas: #66, #67, #70, #79, #81, #82, #86; abertas: #68, #83 |
| 3 | #71, #72, #73, #74, #75, #76, #77, #78 | dependem do detalhe, do card ou do serviço de carregamento | integradas: #71, #72, #73, #74, #77, #78; com PR aberto: #75, #76 |
| 4 | #85 | depende de #70 e #71 | integrada em 07/10 |

O que de fato aconteceu:

- a #69 foi a primeira demanda de funcionalidade integrada (06/10, 01h59),
  como planejado, e destravou as Issues que alteram a listagem;
- a #80 (padrão visual) não foi entregue antes das demais. As demandas que a
  usariam seguiram com os estilos existentes;
- a #85 foi integrada depois de #70 e #71, respeitando a dependência.

## 2. Arquivos compartilhados

Contagem feita a partir dos arquivos alterados em cada Pull Request do CP2.
A tabela da Issue #59 citava `src/pages/LocaisPage.tsx`; esse arquivo foi
movido para `src/pages/Locais/index.tsx` pela #69.

| Arquivo | Issues que o alteraram |
|---|---|
| `src/pages/Locais/index.tsx` | #69, #70, #74, #75, #76, #77, #84, #85 |
| `src/index.css` | #70, #74, #75, #76, #78, #79 |
| `src/pages/DetalheLocal/index.tsx` | #67, #73, #74, #78, #84 |
| `src/LocaisProvider.tsx` | #70, #71, #73, #74, #85 |
| `src/pages/Cadastro/index.tsx` | #64, #70, #72, #84 |
| `src/LocaisContext.ts` | #70, #73, #74, #85 |
| `src/services/locais.ts` | #70, #71, #85 |
| `src/services/cadastroLocal.ts` | #73, #74, #86 |
| `src/routes/AppRoutes.tsx` | #67, #73 |
| `src/persistenciaLocais.ts` | #71, #85 |
| `src/App.tsx` e `src/layouts/MainLayout/MainLayout.tsx` | #79, #108 |

`LocaisProvider.tsx` e `pages/Locais/index.tsx` concentraram os conflitos do
ciclo: os PRs #93, #102 e #106 precisaram de resolução depois que outra
demanda do mesmo arquivo foi integrada.

## 3. Combinado de integração

- A #69 entra primeiro. Quem altera a listagem só abre o Pull Request depois
  de atualizar a branch com `develop` já contendo a #69.
- Antes de pedir revisão, o autor atualiza a branch com `develop` e roda
  `npm run lint`, `npm run build` e `npm test` (Tutorial 07, Parte B).
- Conflito em `package-lock.json` não é resolvido à mão: o autor traz o
  arquivo de `develop` (Tutorial 07, Parte F).
- Em conflito no fim do prazo, quando o autor não pode resolver a tempo, o
  Tech Lead resolve na própria branch do Pull Request, sem alterar o escopo, e
  explica a resolução no commit. Foi o caso dos PRs #93, #102 e #106.
- Cada Pull Request recebe um Tech Lead e um QA como revisores. O professor
  não é revisor obrigatório de cada PR.

## 4. Decisões técnicas do ciclo

| Data | Decisão | Motivo | Issues afetadas |
|---|---|---|---|
| 02/10 | Issues do CP2 reescritas com escopo, critérios de aceite, dependências e riscos; responsáveis redistribuídos | as Issues originais não traziam critérios testáveis, e as demandas que bloqueiam outras precisavam de responsáveis com entrega garantida | #59 a #86 |
| 06/10 | A listagem oficial é `src/pages/Locais/index.tsx`; a página esqueleto com dados fictícios foi removida | o merge do PR #53 havia apontado `/locais` para o esqueleto, e um local cadastrado não aparecia na listagem | #69, #68, #70, #75, #76, #77 |
| 06/10 | O carregamento dos locais fica em `carregarLocais()`, em `src/services/locais.ts`, assíncrono e simulado, com os estados carregando, pronto e erro | não há API no projeto (decisão do professor em 17/09); a simulação permite exibir carregamento e erro | #70, #71, #85 |
| 06/10 | Sanitização e validação acontecem dentro de `criarLocal` e, depois, de `editarLocal` | todo caminho de gravação passa pela mesma regra, independentemente da tela | #86, #71, #73 |
| 06/10 | O projeto exige Node 22.22 ou mais recente, declarado em `.nvmrc` e `engines`; o erro de `npm ci` após atualização de dependência foi documentado | o `react-router` 8.4 exige essa versão, e branches atualizadas ficaram com `package.json` e `package-lock.json` misturados | #99 |
| 07/10 | `carregarLocais()` lê a lista salva no `localStorage` antes de usar os dados de exemplo; a gravação só acontece com o estado "pronto" | gravar durante o carregamento apagava a lista salva, e a versão inicial nunca lia o que foi gravado | #71, #85 |
| 07/10 | IDs de locais excluídos não são reutilizados na sessão; a confirmação de exclusão usa `<dialog>` | evitar que um link antigo abra outro local; o `<dialog>` controla o foco | #74 |
| 07/10 | Dados de reserva não sobrescrevem a lista salva sem ação do usuário; cadastro, edição e exclusão marcam a lista como alterada | uma falha de leitura não pode apagar os locais do usuário | #85, #71, #73, #74 |
| 07/10 | A aplicação usa um único roteador, do `react-router`, em `src/main.tsx`; `react-router-dom` foi removido | o PR #104 criou um segundo roteador, e o foco na troca de rota deixou de funcionar na navegação por links | #108, #79 |
| 07/10 | A #72 foi reatribuída a @ChrisVerBarbuto | o responsável anterior não iniciou a demanda nem respondeu, e ela era necessária para o CP2 | #72 |
| Pendente | Componente único para mensagens padronizadas | depende da #80, ainda aberta; a mensagem de edição concluída (#73) usa `--accent` provisoriamente, porque `--success` não existe no `index.css` | #80, #72, #73, #85 |

## 5. Revisões dos Pull Requests

Revisão conforme o Tutorial 04: relação com a Issue (`Closes #N`), CI,
escopo e atualização da branch. A coluna "Aprovações" mostra a última revisão
de cada revisor que estava válida no momento do merge. A coluna "Branch no
merge" indica se a branch continha o último commit de `develop` quando foi
integrada (seção 6).

| PR | Issue | Autor | Aprovações | CI | Branch no merge | Observação |
|---|---|---|---|---|---|---|
| #87 | #60 | @kkuras | @matheusfa08, @tiagostnz | ok | atualizada | |
| #88 | #86 | @guimmalmd | @kkuras | ok | defasada | |
| #91 | #69 | @juansouzamarques | @dudupizzoli, @kkuras | ok | atualizada | substituiu o #90, fechado |
| #92 | #64 | @Brenoell | @kkuras | ok | defasada | |
| #93 | #71 | @LeonardoSilva1203 | @kkuras | ok | atualizada | conflito resolvido pelo Tech Lead; corrigida a leitura da lista salva, com teste |
| #94 | #70 | @JoaoVitor-2209 | @matheusfa08, @tiagostnz | ok | atualizada | |
| #96 | #82 | @BeaUrbano | @joaovjbernardo, @kkuras, @tiagostnz | ok | atualizada | substituiu o #95, fechado |
| #97 | #67 | @Renatoruiz1 | @matheusfa08, @tiagostnz | ok | defasada | |
| #98 | #81 | @ChrisVerBarbuto | @Brenoell, @tiagostnz | ok | defasada | |
| #100 | #99 | @tiagostnz | @kkuras, @matheusfa08 | ok | defasada | |
| #102 | #74 | @SophiaS4nt | @tiagostnz | ok | atualizada | conflito resolvido pelo Tech Lead |
| #103 | #77 | @Lucasvieira-tech | @Brenoell, @kkuras | ok | atualizada | |
| #104 | #79 | @gustavopontes1104 | @Brenoell, @kkuras | ok | defasada | introduziu o segundo roteador, corrigido pela #108 |
| #105 | #66 | @geovannasecchi | @joaovjbernardo, @kkuras | ok | defasada | |
| #106 | #73 | @Leite-1309 | @tiagostnz | ok | atualizada | conflito resolvido pelo Tech Lead; edição passou a marcar a lista como alterada |
| #107 | #78 | @HenriqueOsuka | @dudupizzoli, @kkuras | ok | defasada | |
| #109 | #108 | @tiagostnz | @kkuras | ok | defasada | |
| #110 | #85 | @Thiagordsr | @tiagostnz | ok | defasada | |
| #113 | #72 | @ChrisVerBarbuto | @Brenoell, @tiagostnz | ok | atualizada | |

Pull Requests ainda abertos em 07/10:

| PR | Issue | Autor | Situação |
|---|---|---|---|
| #101 | #75 | @sophRmd | reprovado pelo QA (@TailyniDev); aguarda correção |
| #111 | #84 | @sabrinafraga | aprovado por @tiagostnz |
| #112 | #76 | @Tadeul | aprovado por @tiagostnz |

Pontos de atenção:

- nos PRs #102 e #106, o Tech Lead que resolveu o conflito foi também o único
  aprovador depois da resolução. O ideal é que outra pessoa revise a
  resolução;
- os PRs #88, #92, #109 e #110 tiveram uma única aprovação, sem QA.

## 6. Atualização das branches no merge

Para cada Pull Request integrado, foi conferido no histórico do Git se a
branch continha o último commit de `develop` no momento do merge: o primeiro
pai do commit de merge precisa ser ancestral do segundo.

Resultado: **10 dos 19 Pull Requests integrados estavam defasados** em
relação a `develop`. O critério da Issue #59 ("nenhum Pull Request integrado
com a branch defasada") não foi atendido.

Isso foi possível porque a proteção de `develop` não exige branch atualizada
antes do merge. O GitHub integra sem aviso quando não há conflito textual,
mas o código resultante nunca foi testado junto, que é o risco que causou o
problema do PR #53 no CP1.

Recomendação para o CP3, a decidir com os Tech Leads e o professor: ativar
"Require branches to be up to date before merging" na proteção de `develop`.
O botão "Update branch" do GitHub resolve a maioria dos casos sem uso do
terminal.

## 7. Verificação final do fluxo em `develop`

### Verificação automatizada

Commit verificado: `c360bf8` (`develop` em 07/10/2026), Node 22.23.2.

| Verificação | Resultado |
|---|---|
| `npm ci` | sem erros |
| `npm run lint` | sem erros |
| `npm run build` | sem erros |
| `npm test` | 66 testes, 66 aprovados |
| Rotas em `src/routes/AppRoutes.tsx` | `/`, `/locais`, `/locais/:id`, `/locais/:id/editar`, `/cadastrar`, `/sobre`, `/acessibilidade` e `*` |
| Referências a `react-router-dom` | nenhuma |

### Percurso no navegador

| Etapa | Resultado | Evidência |
|---|---|---|
| Home | pendente | |
| Listagem | pendente | |
| Busca | pendente | |
| Filtros | pendente | |
| Detalhe | pendente | |
| Cadastro | pendente | |
| Persistência após recarregar a página | pendente | |
| Edição | pendente | |
| Exclusão | pendente | |
| Foco na troca de rota | pendente | |

O percurso no navegador será executado após a integração dos últimos Pull
Requests do ciclo, com `npm run build && npm run preview`.
