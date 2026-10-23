# Relatório do QA

## Identificação

- Turma: 1TDSPJ
- Squad: Grupo 3
- CP: 03
- QA responsável: Breno Elisio Leal Lobato
- Data e horário: 22/10/2026 - 21:51
- Issue testada: 130
- Pull Request: a criar
- Versão ou commit:
- Ambiente: 
- Link ou identificação do ambiente testado:

## Escopo do teste

Validar o funcionamento do sistema de favoritos do Portal de Locais Acessíveis, verificando a inclusão e remoção de locais favoritos, a persistência dos dados após recarregar a página, a listagem de favoritos, a atualização do contador, a combinação com filtros e o tratamento de situações excepcionais.

Também será verificada a acessibilidade do botão de favorito por meio do atributo aria-pressed, além da execução de testes automatizados com node:test.

## Pré-condições e dados

- Estado inicial: Aplicação aberta no navegador, com a página de locais acessíveis carregada e sem alterações nos favoritos antes do início dos testes.
- Dados utilizados: Locais acessíveis disponíveis na aplicação, utilizando os controles de favoritos para adicionar, remover e verificar a persistência dos locais selecionados.
- Navegador e dispositivo: Google Chrome em computador com Windows 11.
- Dependências: Aplicação Portal de Locais Acessíveis em execução, navegador atualizado e acesso às funcionalidades de favoritos.

## Critérios de aceite

| Critério | Resultado | Evidência | Observação |
|---|---|---|---|
| Adicionar e remover favoritos | Aprovado | A anexar | Testar pelo cartão e pela página de detalhes |
| Estado acessível do botão (`aria-pressed`) | Aprovado | Foi realizado uso de Inspecionar -> Elementos e verificação se a área do botão alterava conforme clicado. O que gerou sucesso. https://postimg.cc/ykrddBsw/8b75c78e | - |
| Persistência dos favoritos | Aprovado | Foi realizado  a Atualização da página com ou sem locais favoritados, o que resultou em sucesso https://postimg.cc/94yFJ7ZX/8f273c4b | Recarregar a página e verificar os dados |
| Listagem de favoritos | Aprovado | Ao selecionar os locais favoritos, eles são listado de forma certa. https://postimg.cc/94yFJ7ZX/8f273c4b
 | Testar lista vazia e preenchida | Aprovado | https://postimg.cc/ppyW37zq/5ba7ea8e  https://postimg.cc/7GsvVHs2/63eab7b5 | Verificar inclusão e remoção |
| Contador de favoritos | Aprovado | https://i.postimg.cc/8c1Vq9Vm/image.png [semselecao.png](https://postimg.cc/68NPC4WL)| Verificar inclusão e remoção |
| Combinação de favoritos com filtros | Aprovado | [pesquisafav.png](https://postimg.cc/56F06Tyy) [pesquisafaverecurso.png](https://postimg.cc/WhMVRvtH) [pesquisafavcultura.png](https://postimg.cc/WqgBPGpp)| Testar busca, categoria e recursos de acessibilidade |
| Exclusão de local favoritado | Aprovado | [imagemtratamento.png](https://postimg.cc/LhLw5VRm) | Verificar o tratamento do local removido |
| `localStorage` indisponível | Aprovado | [codigo.png](https://postimg.cc/Lnf1rnzv) [msgerro.png](https://postimg.cc/Q99t1ySd) | Verificar o tratamento de exceções |
| Dados inválidos no `localStorage` | Aprovado | [msgerro.png](https://postimg.cc/v198mVmx) | Verificar se a aplicação continua funcionando |
| Testes automatizados com `node:test` | Aproavado | [Rrelatorio.png](https://postimg.cc/3yZ698SX) | Registrar comando e resultado da execução |

## Cenários adicionais

| Cenário | Resultado esperado | Resultado encontrado | Situação |
|---|---|---|---|
| Dados válidos | Os favoritos são carregados e exibidos corretamente. | Funciona perfeitamente | Aprovado |
| Dados inválidos | A aplicação trata dados inválidos no `localStorage` sem travar ou apresentar falhas inesperadas. |  Funciona perfeitamente avisando o usuario | Aprovado |
| Falha da API | Caso a funcionalidade dependa de uma API, a aplicação apresenta um tratamento adequado para a falha, sem quebrar a interface. | Funciona perfeitamente lavisando o usuario | Aprovado |
| Navegação por teclado | É possível acessar e utilizar os controles de favoritos com teclado, com foco visível e estados acessíveis. | Funciona perfeitamente | Aprovado |
| Responsividade | Os favoritos, os filtros e os controles permanecem utilizáveis em diferentes larguras de tela. | Funciona perfeitamente | Aprovado |

## Defeitos encontrados

Nenhum defeito foi encontrado;

## Reteste

- Data: -
- Versão: -
- Correção confirmada: -
- Novos problemas: -
- Evidências: -

## Decisão

- [x] Aprovado
- [ ] Aprovado com ressalva
- [ ] Reprovado
- [ ] Bloqueado

## Justificativa da decisão

Mediante aos teste realizado é possível dizer que ele segue de forma correta todos os critérios de aceite, não precisando de mudanças.
## Declaração do QA

- [x] Testei a versão identificada neste relatório.
- [x] Não criei requisito novo para reprovar a demanda.
- [ ] Registrei os defeitos de forma reproduzível.
- [x] Não incluí dado pessoal, senha ou token nas evidências.
