# Integração de Favoritos e Geolocalização (CP3)

- Issue: #129
- Responsável: Flavio Luiz Kuratomi Junior (@kkuras), TECH-LEAD
- Prazo: 22/10/2026

## 1. Objetivo e contexto

Favoritos (#135 a #141) e geolocalização (#144 a #146) somam dez demandas
que dependem umas das outras. As duas bases (#135 e #144) criam contextos
novos em `src/App.tsx`, e as demais alteram os mesmos arquivos:
`LocalCard`, `DetalheLocal`, `Header` e a página de listagem.

Este documento define a ordem de integração, registra as interfaces das
bases, o resultado do checkpoint de 16/10 e a verificação final em
`develop`.

## 2. Ondas de integração

| Onda | Issues | Motivo |
|---|---|---|
| 1 | #135, #144 | criam os contextos usados pelas demais |
| 2 | #136, #137, #138, #145, #146 | dependem apenas da onda 1 |
| 3 | #139, #140 | dependem da página de favoritos |
| 4 | #141 | testa o fluxo completo |

### Ordem real de integração em `develop`

| Data | PR | Issue | Onda |
|---|---|---|---|
| 14/10 | #165 | #135 | 1 |
| 15/10 | #167 | #136 | 2 |
| 15/10 | #170 | #138 | 2 |
| 18/10 | #168 | #144 | 1 |
| 20/10 | #174 | #137 | 2 |
| 20/10 | #176 | #145 | 2 |
| 21/10 | #181 | #139 | 3 |

Situação de #140, #141 e #146: não iniciada.

## 3. Arquivos compartilhados

| Arquivo | Alterado por | Risco de conflito |
|---|---|---|
| `src/App.tsx` | #135, #144 | médio: cada um adiciona seu Provider |
| `src/components/LocalCard/index.tsx` | #136, #137, #145 | alto: três PRs |
| `src/pages/DetalheLocal/index.tsx` | #136, #145 | alto: botão e distância |
| `src/components/Header/index.tsx` | #137, #139 | médio |
| `src/pages/Locais/index.tsx` | #138, #144 | médio |
| `src/types/local.ts` | #138, #144 | médio |
| `src/components/BotaoFavorito/index.tsx` | #136, #137 | médio |

Quem integra primeiro: a base de favoritos (#135) e a de geolocalização
(#144), antes de qualquer PR da onda 2. Dentro da onda 2, os PRs que
alteram `LocalCard` e `DetalheLocal` (#136 e #145) devem entrar em
sequência, e não em paralelo.
