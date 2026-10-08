# Issue #80 — evidências

Uso das classes e de `Mensagem`: [guia de interface](../padroes-interface.md).

## Resultados

Verificação em 07/10/2026: lint e build sem erros; 78 testes aprovados.
Navegador: claro, escuro e alto contraste, desktop/mobile, sem erros JavaScript.
Botões medidos com alvo mínimo de 44 × 44 px; foco, erros e mensagens conferidos.

Contraste do botão **Cadastrar local**, calculado pelas cores do navegador:

| Modo | Texto | Fundo | Contraste |
| --- | --- | --- | --- |
| Claro | `#ffffff` | `#6d28d9` | 7,10:1 |
| Escuro | `#16171d` | `#c084fc` | 6,77:1 |
| Alto contraste | `#000000` | `#ffff00` | 19,56:1 |

## Capturas e registros

[Baixar evidências completas](evidencias.zip): 15 capturas antes, 30 depois,
logs de lint/build/test e medições de contraste, alvos, bordas e foco.
Os arquivos foram consolidados sem perda: os 54 originais foram verificados
por SHA-256. A documentação original também está no ZIP para rastreabilidade.

Comparação rápida pelo histórico preservado (campos/erros e botões/sucesso):

| Modo | Antes | Depois |
| --- | --- | --- |
| Claro | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/claro-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/claro-cadastro-sucesso.png) | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/claro-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/claro-cadastro-sucesso.png) |
| Escuro | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/escuro-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/escuro-cadastro-sucesso.png) | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/escuro-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/escuro-cadastro-sucesso.png) |
| Alto contraste | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/alto-contraste-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/antes/alto-contraste-cadastro-sucesso.png) | [campos](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/alto-contraste-cadastro-invalido.png) · [botões](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/2131fa37527e580e758ec1bf9e69bf07e29db6a0/docs/cp2/issue-80/depois/alto-contraste-cadastro-sucesso.png) |

## Reproduzir

Execute `npm run lint`, `npm run build` e `npm test`. Para o navegador, mantenha
`npm run dev` aberto e use um Playwright e Chromium/Chrome/Edge já disponíveis:

```sh
node tests/browser/padroes-interface.cjs --playwright "<modulo-playwright>" --chromium "<executavel-do-navegador>" --base-url http://127.0.0.1:5173
```

Saída padrão: `work/issue-80.local/depois`, ignorada pelo Git; `--saida` permite
outra pasta. Baseline em `157038e`; resultado sobre `c360bf8`, sem mudança upstream
nas áreas comparadas. Leitor de tela real, revisão técnica e decisão do QA pendentes.
