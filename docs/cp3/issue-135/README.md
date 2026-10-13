# Base de favoritos — Issue #135

Os favoritos são IDs inteiros guardados em `locais-favoritos`. Não há conta,
login, sincronização entre dispositivos ou alteração nos botões do portal.

## Interface para as Issues dependentes

`useFavoritos`, importado de `src/useFavoritos.ts`, oferece:

```ts
{
  favoritos: number[];
  ehFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => void;
  totalFavoritos: number;
}
```

- `favoritos` contém os IDs, e não os objetos dos locais. Não modificar a lista
  diretamente; usar `alternarFavorito`.
- `ehFavorito(id)` consulta a seleção atual.
- `alternarFavorito(id)` inclui ou remove o ID. As atualizações usam o estado
  anterior, inclusive quando duas chamadas acontecem no mesmo evento.
- `totalFavoritos` é derivado da lista e acompanha as alterações.

O `FavoritosProvider` fica dentro de `LocaisProvider` em `App.tsx`, acima do
layout e das rotas. A interface pode ser usada pelas Issues #136–#140 a partir
desta feature, aguardando sua integração pelo fluxo de revisão.

## Decisões da implementação

`favoritos.ts` separa as operações do React, no padrão de `persistenciaLocais`.
`alternarFavorito` devolve uma lista nova. `validarFavoritos` devolve uma cópia
válida ou `null`, rejeitando a lista inteira se houver item inválido ou repetido.
Não há conversão de texto para número nem aproveitamento parcial de conteúdo
corrompido.

Leitura e gravação tratam falhas do armazenamento. Quando a leitura não pode
ser feita, o estado começa vazio. Quando a gravação falha, a mudança continua
ativa em memória, mas pode ser perdida ao recarregar. O módulo também evita
substituir uma lista salva válida por dados inválidos enviados à gravação.

A limpeza acontece somente com `estado === "pronto"` e `usandoReserva === false`.
Ela compara os IDs com a lista confiável e só altera o estado quando há remoção,
antes de renderizar os consumidores. O efeito fica responsável pela gravação no
navegador. A condição evita a atualização síncrona de estado em um efeito,
rejeitada pelo lint do projeto.

## Validações executadas

- `npm ci`: instalação pelo lockfile, sem alterar dependências.
- `npm run lint`: sem erros ou avisos.
- `npx tsc -b --force`: sem erros de tipos.
- `npm run build`: concluído.
- `npm test`: **146 testes aprovados**, incluindo 19 testes do módulo e
  10 testes do provider e do hook adicionados nesta demanda.
- Verificação de tipos da entrada de navegador com `tsc`, incluindo `vite/client`.
- 13 cenários no navegador em `StrictMode`, registrados em `navegador.json`.
- Abertura da listagem e das rotas de início, cadastro, detalhe, sobre,
  acessibilidade e página não encontrada; resultados em `rotas.json`.

A saída de build e dos testes está em `validacao.txt`. Os dois logs de erro
observados no navegador correspondem à falha deliberada de carga, executada
também pelo ciclo adicional do StrictMode. Não houve falha inesperada de renderização.

## Reproduzir no navegador

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 53135 --strictPort
```

A entrada `tests/fixtures/favoritos.html` é exclusiva do teste no servidor de
desenvolvimento. Ela não é uma rota do portal nem entra no JavaScript de produção.
Use essa origem de teste separada para não trocar os dados de outro ambiente.

1. Abra `http://127.0.0.1:53135/tests/fixtures/favoritos.html?cenario=pronto&salvo=%5B%5D`.
2. Aguarde `pronto`, alterne o favorito 42 e clique em **Conferir armazenamento**.
3. Confira `[42]` na lista e no armazenamento. Recarregue e confira novamente.
4. Use **Alternar 1 e 2 juntos**: as duas mudanças devem aparecer. Ao alternar
   o mesmo ID duas vezes, os IDs e o total voltam à seleção anterior; a ordem
   pode mudar porque uma inclusão vai para o fim da lista.
5. Exclua um local favorito: o ID e o total devem ser atualizados e persistidos.
6. Abra a entrada com `?cenario=lento&salvo=%5B42%2C1%5D`: durante os cinco
   segundos de carga, os dois favoritos devem permanecer.
7. Abra com `?cenario=reserva&salvo=%5B42%2C1%5D`: o ID 42 deve permanecer mesmo
   ausente da reserva. Use **Carregar lista sem 42**: quando a carga confiável
   terminar, somente o ID 1 permanece. **Carregar lista vazia** remove todos.
8. Abra com `?cenario=pronto&salvo=%7Binvalido`: a lista começa vazia. Uma
   semente `%5B1%2C1%5D` também é rejeitada.
9. Abra com `?cenario=bloqueado&salvo=%5B%5D`: alterne IDs com mouse e Enter.
   Eles funcionam na sessão e o painel informa armazenamento indisponível.
10. Abra com `?cenario=sem-espaco&salvo=%5B42%5D`: acrescentar o ID 1 muda o
    estado para `[42,1]`, mas o valor salvo continua `[42]`.

O parâmetro `salvo` prepara a semente uma vez e sai da URL. Assim, recarregar
realmente testa a leitura do que foi persistido, sem reinicializar os dados.
As simulações de bloqueio e quota terminam ao sair dessa entrada de teste.

## Evidências e pendências

As imagens `01` a `09` mostram a lista, o total e o valor lido pela entrada de
teste. `10-portal-integrado.jpg` mostra a listagem com o provider incluído.

**Essas imagens são do painel de inspeção da entrada de teste, não do DevTools.**
O navegador disponível para esta execução não abriu o painel DevTools. A captura
literal solicitada na Issue ainda deve ser anexada pelo responsável ou pelo QA:
abra Application/Aplicativo → Local Storage, selecione a origem de teste e
mostre a chave `locais-favoritos` depois de favoritar.

A Issue também estava sem Project vinculado, com squad/esforço/data limite
desmarcados no checklist de início. Essa pendência de planejamento deve ser
regularizada pelo Tech Lead. O PR aguarda revisão técnica e QA; nenhum merge foi feito.
