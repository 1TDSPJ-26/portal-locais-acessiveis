# Verificação de navegador — issue #80

O roteiro opcional `tests/browser/padroes-interface.cjs` usa um Playwright já disponível, sem alterar as dependências do projeto. O Vite precisa estar em execução antes da chamada. O argumento `--playwright` aceita o nome do módulo ou seu caminho; `--chromium` aceita um executável Chromium/Chrome/Edge existente.

```powershell
node tests/browser/padroes-interface.cjs --playwright '<caminho-do-modulo-playwright>' --chromium '<caminho-do-browser>' --base-url http://127.0.0.1:5180 --fase depois
```

O argumento `--saida` altera a pasta de evidências (padrão: `docs/cp2/issue-80`). A fase `antes` captura a interface inicial; a fase `depois` também exige os padrões da issue e grava as medições em `depois/verificacoes.json`.

## Capturas iniciais

As 15 imagens da pasta `antes/` foram capturadas antes da alteração dos componentes e do CSS. Cada tema (claro, escuro e alto contraste) possui cadastro inválido, confirmação de cadastro, listagem com dados de reserva e Header desktop/mobile. O log `antes/browser.txt` confirma a execução das capturas, a ausência de erros JavaScript e de rolagem horizontal em 375px; ele não afirma conformidade dos padrões novos.

Proveniência: a baseline foi capturada sobre `develop` em `157038e`. O trabalho foi reaplicado sobre `origin/develop` em `c360bf8`, que integrou a edição e a trilha de navegação, e a fase depois foi executada novamente nessa base com os padrões da issue. Cadastro, Locais, Header e os quatro componentes de campo não mudaram entre as duas bases de `develop`; por isso as capturas iniciais dessas interfaces foram preservadas. As evidências adicionais de edição possuem somente fase depois.

O modo claro/escuro acompanha a emulação de `prefers-color-scheme`. Alto contraste foi ativado pela ação visível do Header. A fixture `tests/fixtures/locais.html` fornece cenários determinísticos com as rotas `/cadastrar` e `/locais`; o seletor no topo identifica explicitamente a entrada exclusiva de teste.

## Escopo da fase depois

- Bases e variantes de botão, campo, checkbox e mensagem no DOM.
- Dimensões mínimas de 44×44px para botões visíveis e links de ação `.botao`.
- Validação com um resumo de alerta focado e erros associados aos dez campos obrigatórios, sem `role`/`aria-live` individual.
- Bordas de erro com pelo menos 2px e a cor do rótulo de erro, foco visível por teclado e contraste calculado de pelo menos 4,5:1 nos textos de controles e mensagens examinados.
- Confirmação em região nomeada `Cadastro concluído`, com foco no título e sem anúncio vivo duplicado; reinício do cadastro com foco no nome.
- Aviso de reserva com anúncio cortês, preservação do armazenamento inválido e recuperação acionada com Enter.
- Header mobile aberto por Enter, navegação/ciclo com Tab e Shift+Tab, fechamento por Escape com retorno do foco e fechamento após navegação.
- Edição nos três temas: Salvar primário/Cancelar secundário, cancelar preserva os dados, resumo focado com cinco erros obrigatórios e dois erros de contato, salvar por Enter persiste o nome/mantém o identificador e mostra confirmação cortês no detalhe.
- Ausência de erros JavaScript e rolagem horizontal de documento/corpo em 375px, medida na listagem ainda com reserva antes da recuperação/navegação, no cadastro após navegação, na edição e no detalhe após salvar.

As medições de contraste usam as cores computadas e compõem os fundos transparentes dos elementos examinados até o fundo da página. Não constituem auditoria de imagens/gradientes nem de toda a aplicação. O roteiro verifica a semântica de anúncios pelo DOM; não foi realizado teste com leitor de tela real.

Ambiente das capturas iniciais: Microsoft Edge instalado em `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, Playwright disponibilizado pelo runtime local, viewport desktop 1366×1100px e mobile 375×812px. A imagem desktop recorta o topo da página para manter legíveis os componentes em revisão.

## Resultado registrado em 07/10/2026

A execução final da fase depois passou nos três temas, com zero erros JavaScript. Foram medidas 543 combinações de texto/fundo (menor contraste: 5,45:1), 177 ocorrências de alvos (menor largura e altura: 44px), 21 estados de foco, 51 bordas de erro e 12 verificações de largura do documento/corpo. Os números incluem os mesmos controles examinados em contextos e temas diferentes; não representam contagem de componentes únicos.

A pasta `depois/` contém 30 imagens: 15 comparáveis à baseline e, em cada tema, cinco adicionais (menu mobile aberto, viewport da listagem com reserva, painel de aviso de reserva mobile, edição inválida e confirmação de edição mobile). `depois/browser.txt` contém o resultado efetivo; `depois/verificacoes.json` conserva as dimensões, cores, razões de contraste, bordas e estilos de foco utilizados pelas asserções. As capturas de cadastro, listagem mobile, menu, edição inválida e confirmação de edição foram inspecionadas visualmente após a execução.
