# Relatório do QA

## Identificação

- Turma: 1TDSPJ
- Squad: 5
- CP: CP2
- QA responsável: Tailyni Victoria Renovato Satirio (@TailyniDev)
- Data e horário: 09/10/2026 7:00
- Issue testada: #62, que valida #69, #70, #75, #76 e #77
- Pull Request: PR desta Issue (`Closes #62`) <!-- colocar o link do PR --> | PRs revisados: #101 (#75) e #112 (#76)
- Versão ou commit: `323de87` (testes na tela e comandos `npm test`, `lint` e `build`) | PRs revisados: #101 `5e82c48` e #112 `2e8be23`
- Ambiente: local, `npm run dev`
- Link ou identificação do ambiente testado: http://localhost:5173/locais
- Navegador e dispositivo: Google Chrome, Windows (responsividade testada na emulação de celular do Chrome)

## Escopo do teste

**Testado:** busca, filtros (categoria e recursos de acessibilidade), paginação, ordenação e estados vazios da página `/locais`, isoladamente e combinados; sincronização de busca e filtros com a URL; verificação automatizada da regra de filtragem (`src/utils/filtrar-locais.ts`).

**Fora deste ciclo:** correção dos defeitos; cadastro, edição e exclusão (#63); rotas e navegação por teclado (#61).

## Pré-condições e dados

- Estado inicial: aplicação recém-iniciada, sem filtros, URL `/locais`
- Dados utilizados: 6 locais de exemplo de `src/data/locais.ts`
- Itens por página: 3
- Navegador e dispositivo: Google Chrome, Windows; um teste em emulação de celular
- Dependências: #69, #70, #75, #76, #77

## Critérios de aceite

| Critério | Resultado | Evidência | Observação |
|---|---|---|---|
| #69: rota `/locais` exibe a `LocaisPage` | Aprovado | Prints da página `/locais` | A rota exibe a listagem real, com busca, filtros, ordenação e paginação. |
| #70: estado de carregamento | Aprovado | Print "Carregando locais…" | Ao recarregar `/locais`, o painel exibe "Carregando locais…" antes dos cards, e o botão "Filtros" aparece desativado. |
| #70: estado vazio | Aprovado | Prints dos estados vazios | Mensagem "Nenhum local encontrado" por busca e por filtros, com botão "Limpar filtros". |
| #70: estado de erro | Não testado | | Não testado neste ciclo. |
| #75: paginação acessível | Aprovado | Prints da paginação (páginas 1 e 2) | Exibe "Exibindo 1 a 3 de 6 locais" e "4 a 6 de 6 locais", com Anterior, Próxima e números de página (Anterior e Próxima desabilitados nos extremos) e o seletor "Locais por página". Ao trocar para 6 ou 12, a paginação e o seletor continuam visíveis. |
| #76: ordenação por nome | Aprovado | Print da ordenação por Nome | Ordem alfabética correta. "Ótica" está coberto por teste, mas não foi visto na tela (os 6 locais de exemplo não o incluem). |
| #76: ordenação por categoria | Aprovado | Print da ordenação por Categoria | Alimentação, Cultura, Lazer e Serviços, com os nomes em ordem dentro de cada categoria. |
| #77: busca e filtros refletidos na URL | Aprovado (parcial) | Prints das URLs `?recurso=Banheiro+acessível` e `?recurso=Entrada+sem+degraus` | Os filtros por recurso são restaurados a partir da URL (caixa marcada, chip ativo e total correto). A busca e a categoria na URL não foram testadas neste ciclo. |

## Cenários adicionais

### Cenários isolados

| Cenário | Resultado esperado | Resultado encontrado | Situação |
|---|---|---|---|
| Busca sem acento (ex.: `cafe`) | Encontra "Café Aurora" | Teste automatizado aprovado | Aprovado |
| Busca com acento (ex.: `café`) | Mesmo resultado da busca sem acento | Teste automatizado aprovado | Aprovado |
| Busca em maiúsculas (ex.: `MUSEU`) | Encontra "Museu da Cidade" | Teste automatizado aprovado | Aprovado |
| Busca com espaços nas pontas | Mesmo resultado da busca sem espaços | Teste automatizado aprovado | Aprovado |
| Cada categoria (Cultura, Alimentação, Lazer, Serviços) | Só locais da categoria escolhida | Teste automatizado aprovado | Aprovado |
| Um recurso de acessibilidade | Só locais com o recurso | Teste automatizado aprovado; na tela, "Banheiro acessível" retorna 4 locais | Aprovado |
| Vários recursos de acessibilidade | Só locais com todos os recursos | Teste automatizado aprovado | Aprovado |
| Estado vazio por busca sem resultado | Mensagem de lista vazia | Busca `zzzz`: "0 locais encontrados", chip "Busca: “zzzz”", mensagem "Nenhum local encontrado / Não foi possível encontrar locais para “zzzz”" e botão "Limpar filtros" | Aprovado |
| Estado vazio por filtros sem resultado | Mensagem de lista vazia | Piso tátil + Audiodescrição + Banheiro acessível: chips ativos e mensagem "Nenhum local encontrado / Tente remover algum filtro ou buscar por outro termo", com "Limpar filtros" | Aprovado |
| Estado de carregamento | Indicador de carregamento visível | "Carregando locais…" visível ao recarregar a página | Aprovado |
| Navegação por teclado (campo "Ordenar por") | Foco visível; setas trocam a opção | Foco visível, setas trocam a opção, sem erro no console | Aprovado |
| Responsividade | Controles utilizáveis em tela estreita | Em emulação de celular no Chrome <!-- confirmar a largura exibida no topo da emulação -->, o botão "Filtros" mostra o contador de filtros ativos, o painel de filtros e o campo "Ordenar por" cabem na tela, e a paginação e o seletor "Locais por página" cabem sem rolagem lateral. | Aprovado |

### Cenários combinados

| # | Passos | Resultado esperado | Resultado encontrado | Situação | Evidência |
|---|---|---|---|---|---|
| C1 | Ir para a página 2 e alterar a busca ou um filtro | Página volta para a 1; paginação reflete o novo total | A página volta para a 1 ao alterar a busca ou o filtro | Aprovado | <!-- print --> |
| C2 | Aplicar filtro e ordenar por nome e por categoria | Ordem correta; primeira página muda conforme a ordenação | Busca "centro" + Categoria e `?categoria=Lazer` + Categoria: ordem correta, contador correto | Aprovado | <!-- print --> |
| C3 | Filtro + ordenação + trocar de página | Ordem se mantém entre as páginas, sem repetir nem perder itens | Sem filtro, ordenado por Categoria: a página 1 mostra Café Aurora, Biblioteca Parque e Museu da Cidade, e a página 2 mostra Cine Horizonte, Parque das Águas e Centro de Atendimento Cidadão. Com o filtro "Banheiro acessível": a página 1 mostra Café Aurora, Biblioteca Parque e Parque das Águas ("Exibindo 1 a 3 de 4 locais") e a página 2 mostra o Centro de Atendimento Cidadão ("Exibindo 4 a 4 de 4 locais"). Ordem mantida, sem repetir nem perder itens. | Aprovado | Prints das páginas 1 e 2, com e sem filtro |
| C4 | Aplicar busca, filtros, ordenação e página; copiar a URL e abrir em outra aba | Mesmo resultado, mesma página e mesma ordem | A URL `/locais?recurso=Banheiro+acessível`, aberta em outra aba, traz o filtro ativo e os mesmos 4 locais. A ordenação volta para "Nome" e a página para a 1, pois não ficam na URL (a Issue #76 deixa a ordenação fora do escopo). | Aprovado com ressalva | Prints das URLs abertas em outra aba |
| C5 | Filtros que não retornam nada com página > 1 | Estado vazio exibido; sem paginação quebrada | Estado vazio exibido corretamente, sem paginação quebrada | Aprovado | <!-- print --> |

## Defeitos encontrados

Nenhum defeito encontrado neste ciclo, na versão `323de87`.

Observações (não são defeitos):
- A ordenação e a página não são guardadas na URL. A Issue #76 deixa a ordenação fora do escopo, e a #77 trata de busca e filtros.
- O estado de erro (#70) e a busca e a categoria na URL (#77) não foram testados neste ciclo.

## Verificação automatizada

- Arquivo: `tests/filtrarLocais.test.mjs` (`node:test`)
- Cobertura: 18 testes de `filtrarLocais` com dados fixos no próprio arquivo: busca com e sem acento, maiúsculas, espaços nas pontas, busca só com espaços, busca em nome e endereço (preservando a ordem), busca sem resultado, cada categoria, categoria vazia, recursos isolados e combinados, combinação de recursos impossível, combinações busca + categoria + recursos (com e sem interseção) e imutabilidade da lista original.
- Resultado de `npm test`: 117 testes, 117 aprovados, 0 falhas (inclui os 18 novos de `filtrarLocais`).
- Resultado de `npm run lint`: ok, 0 warnings e 0 erros (69 arquivos).
- Resultado de `npm run build`: ok (`tsc -b` e `vite build`, 133 módulos).

## Reteste

- Data: 09/10/2026
- Versão: `323de87`
- Correção confirmada: o seletor "Locais por página", que na revisão do PR #101 fazia a paginação, o contador e o próprio seletor sumirem ao escolher 6 ou 12, mantém tudo visível nesta versão.
- Novos problemas: nenhum encontrado nos cenários executados.
- Evidências: prints da paginação e dos cenários combinados.

## Decisão

- [ ] Aprovado
- [x] Aprovado com ressalva
- [ ] Reprovado
- [ ] Bloqueado

## Justificativa da decisão

Na versão `323de87`, a busca, os filtros, a paginação (#75), a ordenação (#76) e os estados vazio e de carregamento (#70) funcionam nos cenários testados, isoladamente e combinados (C1, C2, C3, C4 e C5). A regra de filtragem tem 18 testes automatizados novos, e o `npm test` passa com 117 de 117, com `lint` e `build` sem erros. O defeito do seletor "Locais por página", visto na revisão do PR #101, não se reproduz mais. A aprovação é com ressalva porque não foram verificados neste ciclo o estado de erro (#70) e a busca e a categoria na URL (#77), e o caso "Ótica" foi coberto só por teste automatizado, sem verificação na tela.