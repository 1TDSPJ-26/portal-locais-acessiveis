# Issue #85 — dados de reserva

O carregamento distingue ausência da chave de falha de leitura. JSON ou estrutura inválidos e armazenamento bloqueado acionam a reserva. O Provider expõe `usandoReserva` e não grava essa carga automaticamente. Cadastro e exclusão permitem persistir a lista mediante ação explícita do usuário.

## Reprodução

1. Execute `npm run dev` e abra `/locais`.
2. Em Application > Local Storage, defina `locais-cadastrados` como `{inválido`.
3. Recarregue: confira o aviso e os seis locais de reserva. O valor inválido deve permanecer no armazenamento.
4. Clique em **Tentar novamente**: enquanto o valor continuar inválido, o aviso volta.
5. Troque o valor por `[]` e tente novamente: o aviso desaparece e a listagem informa que não há locais cadastrados.

## Validação

- `npm run lint`, `npm run build` e `npm test`: saídas anexas, 63 testes aprovados.
- `node tests/browser/reserva-locais.cjs <caminho-do-playwright>`: usa Edge instalado, sem alterar dependências do projeto; requer o servidor local na porta 5173. `BROWSER_CHANNEL` permite selecionar outro canal instalado.
- Navegador: JSON corrompido, estrutura inválida, texto vazio, preservação do conteúdo original, falha repetida, recuperação pelo teclado, lista vazia e armazenamento bloqueado.
- Capturas desktop e mobile anexas, inspecionadas visualmente; sem rolagem horizontal em 375px.
- Aviso em região `aria-live="polite"` persistente e `aria-atomic="true"`. Anúncio por leitor de tela não foi verificado com leitor real.

O roteiro antigo `tests/browser/estados-locais.cjs` documenta o comportamento anterior da #70 (falha sem reserva). Para falhas recuperáveis, use o roteiro da #85 acima.

## Pull Request

Closes #85

Integra carregamento com reserva, aviso acessível e nova tentativa. Preserva o armazenamento em cargas de reserva e mantém erro definitivo se a reserva também falhar. Revisão por outra pessoa pendente antes do merge em `develop`.
