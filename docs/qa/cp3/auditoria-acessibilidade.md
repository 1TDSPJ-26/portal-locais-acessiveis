# Auditoria de acessibilidade — CP3

## Identificação e ambiente

- **Data da execução:** 21/10/2026
- **Ambiente:** aplicação local, iniciada com `npm run dev` (`http://127.0.0.1:5173`)
- **Navegador:** Chromium integrado ao ambiente de auditoria; sistema Windows
- **Dados:** locais de exemplo; detalhe e edição testados com o local de ID `1` (Biblioteca Parque)
- **Referência CP2:** [auditoria geral](../cp2/auditoria-acessibilidade.md), [cadastro, edição e exclusão](../cp2/cadastro-edicao.md) e [rotas e teclado](../cp2/rotas-e-teclado.md)
- **Escopo:** `/locais`, `/locais/:id`, `/cadastrar`, `/locais/:id/editar` e diálogo de exclusão.

## Ferramentas e procedimento

- **Lighthouse CLI 12.8.2:** auditoria da categoria Acessibilidade em cada uma das quatro rotas. A pontuação registrada é a pontuação numérica do Lighthouse (0–100).
- **axe-core 4.10.3:** verificação automatizada dos critérios WCAG 2.0/2.1 A/AA e 2.2 AA, nas quatro rotas em tema padrão e alto contraste, e no diálogo nos dois temas. O axe informa violações e verificações inconclusivas; não produz pontuação numérica.
- **`node:test`:** verificação automatizada de que o diálogo de exclusão associa suas referências `aria-labelledby` e `aria-describedby` a elementos existentes dentro do diálogo (`tests/dialogoExclusaoAcessibilidade.test.mjs`).
- **Teclado:** percurso com `Tab` até o ciclo de foco completo em cada rota. No diálogo, foram verificados o ciclo de foco, `Escape`, o botão Cancelar e a devolução do foco.
- **Reflow:** verificação do conteúdo e da largura de rolagem em 320, 480 e 960 px CSS. As larguras de 480 e 960 px representam a área de layout equivalente a 400% e 200% de zoom, respectivamente, tomando 1920 px como referência. **O nível de zoom do navegador não foi alterado diretamente**; esses resultados verificam o reflow nas larguras equivalentes.
- **Leitor de tela:** não foi possível operar NVDA, VoiceOver ou outro leitor de tela neste ambiente. Foram inspecionados os nomes, papéis, estados, landmarks e a árvore de acessibilidade disponibilizada pelo navegador, mas isso não substitui o teste com tecnologia assistiva.

## Resultados automatizados

### Lighthouse

| Página                | Pontuação de acessibilidade | Verificações com falha                                                                  |
| ---------------------- | ----------------------------: | ----------------------------------------------------------------------------------------- |
| `/locais`            |                 **100** | `label-content-name-mismatch` — controles de fonte                                     |
| `/locais/:id`        |                  **96** | `label-content-name-mismatch` — controles de fonte; `target-size` — link de retorno |
| `/cadastrar`         |                 **100** | `label-content-name-mismatch` — controles de fonte                                     |
| `/locais/:id/editar` |                 **100** | `label-content-name-mismatch` — controles de fonte                                     |

A pontuação agregada não representa a ausência de falhas. O Lighthouse reporta `label-content-name-mismatch` em todas as rotas, mas atribui peso zero a essa auditoria; por isso, a falha coexiste com notas 100. A nota 96 do detalhe inclui a reprovação de `target-size`.

### axe-core

| Página / estado       | Tema padrão: violações | Tema padrão: verificações aprovadas | Alto contraste: violações | Alto contraste: verificações aprovadas | Inconclusivas                              |
| ---------------------- | ------------------------: | -------------------------------------: | --------------------------: | ---------------------------------------: | ------------------------------------------ |
| `/locais`            |                         0 |                                     26 |                           0 |                                       26 | `color-contrast`                         |
| `/locais/:id`        |                         0 |                                     25 |                           0 |                                       25 | `color-contrast`, `link-in-text-block` |
| `/cadastrar`         |                         0 |                                     24 |                           0 |                                       24 | `color-contrast`                         |
| `/locais/:id/editar` |                         0 |                                     24 |                           0 |                                       24 | `color-contrast`                         |
| Diálogo de exclusão  |                         0 |                                     10 |                           0 |                                       10 | `color-contrast`                         |

As verificações inconclusivas não são violações confirmadas: exigem inspeção manual. A análise de cores abaixo cobre os principais pares de tokens, mas não resolve automaticamente todos os pares detectados pelo axe.

## Inspeção manual

### Teclado e diálogo de exclusão

O foco percorreu todos os controles visíveis, links e itens de navegação até completar o ciclo, sem perder o indicador visual. Foram percorridos 42 focos em `/locais`, 23 em `/locais/:id`, 37 em `/cadastrar` e 32 em `/locais/:id/editar`. Os campos de formulário, seleções, caixas de seleção, ações dos locais e paginação puderam ser alcançados.

No diálogo:

- `Tab` alterna entre **Cancelar** e **Excluir** sem escapar do diálogo;
- **Enter** em Cancelar fecha o diálogo e devolve o foco ao botão **Excluir local**;
- `Escape` **não fecha** o diálogo no teste: o evento `cancel` não foi disparado e o diálogo permaneceu aberto;
- o diálogo cabe na largura de 320 px: caixa medida de 263 px, sem rolagem horizontal.

O fechamento por Cancelar continua disponível pelo teclado, portanto a falha de `Escape` é registrada como regressão funcional em relação ao CP2, não como violação WCAG confirmada.

### Árvore de acessibilidade e leitor de tela

As páginas expõem landmarks de cabeçalho, navegação, conteúdo principal e rodapé. Os campos de cadastro e edição aparecem com nomes associados, e o diálogo aparece como “Excluir local?” com descrição e botões Cancelar/Excluir. Esses dados vieram da árvore de acessibilidade do navegador; **a experiência falada e os anúncios reais de um leitor de tela permanecem sem validação**.

### Reflow, zoom equivalente e largura estreita

| Página / estado       | 960 px (equiv. 200%)                                | 480 px (equiv. 400%)                                | 320 px                                              |
| ---------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `/locais`            | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura |
| `/locais/:id`        | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura |
| `/cadastrar`         | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura |
| `/locais/:id/editar` | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura | Sem rolagem horizontal ou conteúdo fora da largura |
| Diálogo de exclusão  | —                                                  | —                                                  | Sem rolagem horizontal; diálogo dentro da janela   |

Não foi identificado conteúdo principal cortado nessas larguras. O link “Pular para o conteúdo” fica fora da tela até receber foco, comportamento intencional; ele aparece quando alcançado pelo teclado.

### Contraste

O tema padrão desta execução respeitou a preferência de cores escuras do navegador. Foram calculadas as razões dos principais tokens de texto/fundo:

| Tema e pares representativos              | Razão calculada |             Referência |
| ----------------------------------------- | ---------------: | ----------------------: |
| Padrão escuro: texto principal/cartão   |          14,73:1 | 4,5:1 para texto normal |
| Padrão escuro: texto secundário/cartão |           6,38:1 | 4,5:1 para texto normal |
| Padrão escuro: destaque/cartão          |           6,13:1 | 4,5:1 para texto normal |
| Alto contraste: branco/preto              |             21:1 | 4,5:1 para texto normal |
| Alto contraste: amarelo/preto             |          19,56:1 | 4,5:1 para texto normal |

Os pares acima superam o mínimo de contraste para texto. Como `color-contrast` ficou inconclusivo no axe, esta medição de tokens não certifica todos os textos, estados, imagens ou fundos compostos de todas as páginas.

## Falhas e observações que exigem ação

| # | Severidade | Página / elemento                                           | Critério WCAG                                              | Evidência                                                                                                                                                                                                                                                                                                                                                                      |
| - | ---------- | ------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | Baixa      | `/locais/:id` — link “Voltar para a listagem de locais” | **2.5.8 — Tamanho do Alvo (Mínimo) (AA, WCAG 2.2)** | O Lighthouse mediu alvo de 221,5 × 21 px e área segura de 23 px, abaixo de 24 × 24 px, além do mais, ele não está indicado claramente como botão clicável. Referência: `src/pages/DetalheLocal/index.tsx`, classe `detalhe-voltar`.                                                                                                                               |
| 2 | Moderada   | `/locais/:id/editar` — título do documento               | **2.4.2 — Página com Título (A)**                  | Ao abrir a rota, o título do documento permanece “Portal de Locais e Serviços Acessíveis”, sem identificar a edição do local. As outras rotas auditadas exibem títulos específicos. A rota de edição não define seu próprio `<title>`; o navegador mantém o título base de `index.html`. Referências: `src/pages/EditarLocal/index.tsx` e `index.html`. |

**Observação funcional, sem violação WCAG confirmada:** o `Escape` não fecha o diálogo, ao contrário do resultado descrito no relatório CP2 de cadastro/edição/exclusão. Como Cancelar fecha o diálogo pelo teclado, a falha não impede a operação nem configura, por si só, uma armadilha de teclado.

## Comparação com CP2

| Aspecto            | CP2 registrado                                                                                                                                               | CP3 observado                                                                                                                                                                                 | Comparação                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Automação        | axe DevTools registrou zero problemas nas páginas avaliadas; o próprio relatório alerta que a auditoria precisava ser repetida após novas dependências. | Lighthouse pontuou 100/96/100/100; axe encontrou zero violações, mas Lighthouse detectou divergência entre rótulo visível e acessível em todas as rotas e alvo insuficiente no detalhe. | **Cobertura ampliada e problemas agora explicitados.** A pontuação 100 não elimina as falhas com peso zero. |
| Título da página | CP2 registrou o título estático como defeito aberto.                                                                                                       | Listagem, detalhe e cadastro têm título específico; edição ainda conserva o título genérico.                                                                                           | **Melhorou parcialmente; 2.4.2 continua pendente na edição.**                                                |
| Teclado            | CP2 considerou a navegação aprovada; o relatório de CRUD afirma que `Escape` fecha a confirmação.                                                     | Os percursos completos e o foco visível funcionaram. No diálogo, Cancelar funciona, mas `Escape` não dispara o fechamento.                                                               | **Navegação geral mantida; regressão de comportamento no diálogo.**                                        |
| Zoom e reflow      | CP2 declarou pouca mudança no zoom e aprovação em 200%, sem registrar larguras ou medições.                                                             | Não houve overflow nem corte nas larguras equivalentes a 200%/400% e em 320 px; o zoom real do navegador não foi acionado.                                                                  | **Evidência mais mensurável, mas o teste de zoom real ainda precisa ser feito.**                             |
| Leitor de tela     | O relatório de CRUD do CP2 declara teste com NVDA/VoiceOver.                                                                                                | Árvore de acessibilidade do navegador conferida; leitor de tela real não executado neste ambiente.                                                                                          | **Cobertura manual inferior; validar com NVDA/VoiceOver antes do aceite final.**                               |
| Contraste          | CP2 declarou verificação de temas claro, escuro e alto contraste, sem razões registradas.                                                                 | Pares principais de tokens superam 4,5:1 nos temas medidos, mas o axe deixou verificações de contraste inconclusivas.                                                                       | **Melhor evidência numérica parcial; falta concluir inspeção dos pares restantes.**                        |

## Conclusão

**Resultado: reprovado para aceite final de acessibilidade até a correção das falhas 1–3 e a validação com leitor de tela.** A navegação por teclado, o reflow nas larguras verificadas e os pares de contraste medidos tiveram resultado positivo. Permanecem a divergência entre rótulo visível e nome acessível (WCAG 2.5.3), o alvo abaixo do mínimo no detalhe (WCAG 2.5.8), o título genérico da edição (WCAG 2.4.2), a regressão do `Escape` e as verificações manuais pendentes.
