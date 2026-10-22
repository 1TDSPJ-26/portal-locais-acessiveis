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

## 4. Interfaces expostas pelas bases

### `useFavoritos` (#135)

Arquivos: `src/useFavoritos.ts`, `src/FavoritosContext.ts`,
`src/FavoritosProvider.tsx`.

| Item | Tipo | Descrição |
|---|---|---|
| `favoritos` | `number[]` | ids dos locais favoritados |
| `ehFavorito(id)` | `(id: number) => boolean` | indica se o local é favorito |
| `alternarFavorito(id)` | `(id: number) => void` | favorita ou desfavorita |
| `totalFavoritos` | `number` | quantidade de favoritos |

O hook lança erro se usado fora de `FavoritosProvider`.

### `useLocalizacao` (#144)

Arquivos: `src/useLocalizacao.ts`, `src/LocalizacaoContext.ts`,
`src/LocalizacaoProvider.tsx`.

| Item | Tipo | Descrição |
|---|---|---|
| `estado` | `"inativo" \| "buscando" \| "obtida" \| "erro"` | situação da busca |
| `posicao` | `{ latitude, longitude } \| null` | posição do usuário |
| `erro` | `"permissao-negada" \| "indisponivel" \| "tempo-esgotado" \| "nao-suportado" \| null` | motivo da falha |
| `solicitar()` | `() => void` | pede a localização ao navegador |

O hook lança erro se usado fora de `LocalizacaoProvider`.

### Providers em `src/App.tsx`

`PreferenciasProvider > LocaisProvider > FavoritosProvider >
LocalizacaoProvider`

Validação da interface com os responsáveis de #135 e #144: data e como foi feita; a Issue pedia até 15/10

## 5. Checkpoint de 16/10

| Base | PR | Merge em `develop` | Situação em 16/10 |
|---|---|---|---|
| #135 | #165 | 14/10 22:12 | integrada antes do checkpoint |
| #144 | #168 | 18/10 22:40 | não integrada, 2 dias de atraso |

Efeito do atraso: a #145 (distância) só foi integrada em 20/10, depois da
base. #136 e #138 (ambos em 15/10) dependiam só da base de favoritos e
não foram afetadas.

Plano adotado para não travar as dependentes: nenhum plano

## 6. Revisão dos Pull Requests

| Issue | PR | Autor | Revisão registrada | Resultado | Observações |
|---|---|---|---|---|---|
| #135 | #165 | JoaoVitor-2209 | nulo | nulo | nulo |
| #136 | #167 | Renato | nulo | nulo | nulo |
| #137 | #174 | EUGP2 | nulo | nulo | nulo |
| #138 | #170 | SophiaS4nt | nulo | nulo | nulo |
| #139 | #181 | BeaUrbano | nulo | nulo | nulo |
| #140 | nulo | PedroAndreottiPugliesi | nulo | nulo | nulo |
| #141 | nulo | LeonardoSilva1203 | nulo | nulo | nulo |
| #144 | #168 | milasnt | nulo | nulo | nulo |
| #145 | #176 | henriqueosuka | nulo | nulo | nulo |
| #146 | nulo | Tadeul | nulo | nulo | nulo |