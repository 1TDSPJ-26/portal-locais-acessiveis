# Critérios de qualidade e release do CP2

## 1. Referências

Este documento complementa, e não substitui, as regras já definidas:

- Tutorial 04: revisão técnica e condições de merge
- `.github/PULL_REQUEST_TEMPLATE.md`: verificações do autor
- Tutorial 08: processo de release (congelamento, `release/cp2`, regressão, go/no-go)

Em caso de conflito, vale o Tutorial 04.

## 2. Critérios mínimos para aprovar um Pull Request do CP2

Além do que o Tutorial 04 e o template já exigem, todo PR do CP2 deve atender a:

- [ ] `npm run lint`, `npm run build` e `npm test` terminam sem erros
      (o template pede só lint e build; o CP2 exige também os testes).
- [ ] O check `lint-build-test` está verde antes da revisão funcional.
- [ ] A base é `develop`, a branch segue `feature/NUMERO-descricao-curta` e o PR
      contém `Closes #NUMERO`.
- [ ] Cada critério de aceite da Issue está marcado no PR com a evidência correspondente.
- [ ] Nenhum arquivo fora do escopo foi alterado sem justificativa.
- [ ] Após novos commits, a aprovação anterior deixa de valer e a revisão é refeita.
- [ ] Verificações de acessibilidade da seção 3 aplicadas, quando houver interface.

## 3. Verificações de acessibilidade (entregas com interface)

Cada item tem uma ação e um resultado esperado, para que a resposta seja
apenas "atendido" ou "não atendido".

| Verificação | Ação do revisor | Resultado esperado |
|---|---|---|
| Teclado | Percorrer a tela usando só Tab, Shift+Tab, Enter e Espaço | Todo elemento interativo é alcançável e acionável; a ordem de foco segue a ordem visual; não há armadilha de foco |
| Foco visível | Navegar com Tab observando cada elemento | Todo elemento focado exibe indicador de foco claramente visível |
| Rótulos | Conferir campos, botões e ícones | Todo campo tem rótulo associado; botões só com ícone têm nome acessível; imagens informativas têm texto alternativo |
| Contraste, modo claro | Medir texto e componentes com ferramenta de contraste | Texto normal ≥ 4,5:1; texto grande e componentes de interface ≥ 3:1 |
| Contraste, modo escuro | Repetir a medição no modo escuro | Mesmos valores mínimos |
| Contraste, alto contraste | Repetir a medição no modo de alto contraste | Mesmos valores mínimos, sem perda de informação |

[Confirmar com o professor se o padrão de contraste é WCAG 2.1 AA.]

## 4. Congelamento

- **Data de congelamento do CP2:** [12/10/2026]
- A partir dessa data, nenhuma demanda nova entra na release.
- `release/cp2` é criada a partir de `develop` atualizada, nessa data e não antes.

### Demandas que não ficarem prontas

Demanda que não estiver integrada em `develop` (com PR aprovado pelo Tech Lead
e pelo QA) até a data de congelamento:

1. fica fora da release `cp2`;
2. é listada como "retirada" em `docs/releases/cp2.md`, com o motivo;
3. segue para o próximo ciclo e não entra por exceção.

[Proposta minha; confirmar se o professor aceita exceções.]