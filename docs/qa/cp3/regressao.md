# Relatório do QA

## Identificação

- Turma: 1TDSPJ
- Squad: 4
- CP: 3
- QA responsável: Eduardo Pizzoli Junior (perfil: dudupizzoli)
- Data e horário: 22/10/2025 - 20:12
- Issue testada: [#134](https://github.com/1TDSPJ-26/portal-locais-acessiveis/issues/134)
- Pull Request: 
- Versão ou commit: 4e11b5f
- Ambiente: Local
- Link ou identificação do ambiente testado: http://localhost:4173/

## Escopo do teste

Na Issue #134 são testados os principais fluxos do portal, incluindo navegação e rotas, listagem, busca e filtros, entre outros. O roteiro de regressão (localizado em /roteiro-regressao.md) será executado para verificar os fluxos através de `npm run build && npm run preview` em 2 navegadores e em uma largura de celular.

Observação: Esta issue foi feita antes da entrega de todas as demandas de Dev devido ao seu prazo. 

## Pré-condições e dados

- Estado inicial: aplicação recém-iniciada
- Dados utilizados: 
- Navegador e dispositivo: Google Chrome e Firefox | Windows | Emulação de celular pelo Google Chrome.
- Dependências: Todas as demandas de Dev

## Critérios de aceite

Observação: Todas as evidências estarão disponíveis nos zips com o nome do critério respectivo em `docs/cp3/issue-134`.

| Critério | Resultado | Evidência | Observação |
|---|---|---|---|
| Navegação e Rotas | Aprovado | `navegacao-rotas.zip` | Tanto a navegação por teclado e as rotas pela barra do navegador funcionaram corretamente em todos os cenários de teste. |
| Listagem | Aprovado | `listagem.zip` | Em todos os testes, os locais foram exibidos corretamente. |
| Busca e Filtros | Aprovado | `busca-filtros.zip` | Os locais são filtrados conforme a busca e os filtros selecionados. O botão de limpar filtros fica desativado quando não há nenhum filtro sendo aplicado. Mensagem de “local não encontrado” é exibida quando não há correspondência.  |
| Paginação | Aprovado | `paginacao.zip` | Botões de "anterior" e "próxima" são funcionais. É possível escolher o modo de exibição das páginas e ele está adequado. |
| Ordenação | Aprovado | `ordenacao.zip` | Os locais aparecem em ordem alfabética quando ordenados por nome. Quando ordenados por categoria, aparecem com base na ordem alfabética de suas categorias. |
| Detalhe | Aprovado | `detalhe.zip` | Ao clicar no card, o detalhe do local aparece junto de informações mais detalhadas e as opções de editar e excluir o local. |
| Cadastro | Aprovado | `cadastro.zip` | Quando um campo obrigatório fica vazio, aparece uma mensagem de erro e o local não é cadastrado. Quando todos os campos estão preenchidos corretamente, o local é cadastrado com sucesso e aparece na listagem. |
| Edição | Aprovado | `edicao.zip` | Quando um campo obrigatório fica vazio, aparece uma mensagem de erro e o local não é editado. Quando todos os campos estão preenchidos corretamente, o local é editado com sucesso e suas novas informações aparecem. |
| Exclusão | Aprovado | `exclusao.zip` | A opção de excluir um local aparece no detalhe. Ao clicar nela e depois em "Cancelar", a exclusão é cancelada. Ao clicar em "Excluir", o local é excluído e não aparece mais. |
| Preferências de Exibição | Aprovado | `preferencias.zip` | A fonte do site se ajustava baseando-se nos botões de aumentar/diminuir. O alto contraste era ativado quando seu botão era clicado. “Restaurar padrão” retorna o site a seu formato original. |
| Dados de reserva | Aprovado | `dados-reserva.zip` | Os avisos aparecem quando os dados de reserva estão sendo utilizados |

## Defeitos encontrados

Nenhum defeito foi encontrado durante os testes.

## Decisão

- [ X ] Aprovado
- [ ] Aprovado com ressalva
- [ ] Reprovado
- [ ] Bloqueado

## Justificativa da decisão

Durante os testes foi verificado que as funções implementadas nos CPs 1 e 2 ainda funcionam corretamente e estão em harmonia com as funções implementadas pelo CP3.

## Declaração do QA

- [ X ] Testei a versão identificada neste relatório.
- [ X ] Não criei requisito novo para reprovar a demanda.
- [ ] Registrei os defeitos de forma reproduzível.
- [ X ] Não incluí dado pessoal, senha ou token nas evidências.
