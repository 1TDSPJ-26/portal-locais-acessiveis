# Issue #80 — padrão de interface

Botões primários/secundários, campos e mensagens compartilham o padrão de
`src/index.css` e `src/components/Mensagem/index.tsx`. Os textos de validação,
fluxos de cadastro/edição/exclusão, a paleta existente e as grades das páginas
foram preservados; não foi adicionada biblioteca de componentes.

## Base e compatibilidade

- Branch: `feature/80-padronizar-botoes-campos-mensagens`.
- Clone inicial a partir de `develop` em `157038e`; depois atualizado para
  `c360bf8`, que incorporou a edição de locais e a trilha de navegação.
- As áreas da baseline (Cadastro, Locais, Header e os quatro campos) não mudaram
  entre esses dois commits upstream. As capturas iniciais continuam comparáveis.
- `DetalheLocal` e `EditarLocal` também adotam as classes e mensagens: ambos
  consumiam os estilos antigos removidos, e o botão de salvar edição possuía
  o mesmo problema de `text-black` no tema claro. Isso é compatibilidade visual,
  sem alterar a implementação funcional da Issue #73.
- Dois commits relevantes: base reutilizável/campos/testes unitários/documentação;
  aplicação nas telas/testes de navegador/evidências/compatibilidade com develop.

## Como usar

Consulte [o guia compartilhado do CP2](../padroes-interface.md) para exemplos de
`botao botao--primario`, `botao botao--secundario`, `campo` e `Mensagem`.
As ações de exclusão usam o mesmo padrão secundário; o aviso textual e o diálogo
de confirmação existentes continuam comunicando a consequência da ação.

## Contraste de Cadastrar local

Medição das cores computadas pelo navegador em 07/10/2026, com a configuração
padrão de fonte. As razões completas estão em [verificacoes.json](depois/verificacoes.json).

| Modo | Texto (`--on-accent`) | Fundo (`--accent`) | Razão |
| --- | --- | --- | --- |
| Claro | `#ffffff` | `#6d28d9` | 7,10:1 |
| Escuro | `#16171d` | `#c084fc` | 6,77:1 |
| Alto contraste | `#000000` | `#ffff00` | 19,56:1 |

A versão recebida de develop já usava `text-black`, e não `text-white`, no
cadastro: o defeito atual era o contraste de aproximadamente 2,96:1 no claro.
O novo token elimina a dependência de uma cor fixa e atende aos três modos,
inclusive ao problema de branco sobre o destaque escuro descrito na Issue.

## Evidências e reprodução

- [Lint](lint.txt), [build](build.txt) e [testes unitários](test.txt): saída real dos comandos.
- [Roteiro de navegador, ambiente e limites](browser-README.md).
- [Resultados de navegador](depois/browser.txt) e [medidas efetivas](depois/verificacoes.json).
- [Antes — log](antes/browser.txt): capturas feitas antes da alteração de aparência.

### Comparação visual

| Cenário | Claro | Escuro | Alto contraste |
| --- | --- | --- | --- |
| Campos e erro — antes | [imagem](antes/claro-cadastro-invalido.png) | [imagem](antes/escuro-cadastro-invalido.png) | [imagem](antes/alto-contraste-cadastro-invalido.png) |
| Campos e erro — depois | [imagem](depois/claro-cadastro-invalido.png) | [imagem](depois/escuro-cadastro-invalido.png) | [imagem](depois/alto-contraste-cadastro-invalido.png) |
| Botões e sucesso — antes | [imagem](antes/claro-cadastro-sucesso.png) | [imagem](antes/escuro-cadastro-sucesso.png) | [imagem](antes/alto-contraste-cadastro-sucesso.png) |
| Botões e sucesso — depois | [imagem](depois/claro-cadastro-sucesso.png) | [imagem](depois/escuro-cadastro-sucesso.png) | [imagem](depois/alto-contraste-cadastro-sucesso.png) |
| Listagem e aviso — antes | [imagem](antes/claro-listagem-reserva.png) | [imagem](antes/escuro-listagem-reserva.png) | [imagem](antes/alto-contraste-listagem-reserva.png) |
| Listagem e aviso — depois | [imagem](depois/claro-listagem-reserva.png) | [imagem](depois/escuro-listagem-reserva.png) | [imagem](depois/alto-contraste-listagem-reserva.png) |
| Header — antes | [imagem](antes/claro-header.png) | [imagem](antes/escuro-header.png) | [imagem](antes/alto-contraste-header.png) |
| Header — depois | [imagem](depois/claro-header.png) | [imagem](depois/escuro-header.png) | [imagem](depois/alto-contraste-header.png) |
| Menu mobile — depois | [imagem](depois/claro-menu-mobile.png) | [imagem](depois/escuro-menu-mobile.png) | [imagem](depois/alto-contraste-menu-mobile.png) |

## Pendências externas

A liberação para desenvolvimento foi informada pelo responsável como recebida
do Tiago. Confirmar com o Tech Lead o QA e os campos administrativos do Project,
que ainda estavam desmarcados no corpo da Issue. A revisão técnica humana e a
aprovação do QA não são feitas pelo autor nem por esta automação.

O navegador automatizado verifica semântica/associações ARIA, foco, teclado,
contraste e geometrias. Teste com leitor de tela real permanece a cargo do QA.
Não foram feitas alterações de funcionalidades ou textos para corrigir outros
problemas que já existiam na develop.
