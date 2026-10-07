## Demanda relacionada

Closes #80

## Tipo de alteração

- [x] Nova funcionalidade
- [x] Correção
- [x] Refatoração
- [x] Documentação
- [x] Teste
- [x] Acessibilidade
- [ ] Infraestrutura

## Resumo

Define um padrão compartilhado para botões, campos e mensagens, aplicado ao
cadastro, à listagem e ao Header. Corrige o contraste dos controles com
`--on-accent` nos três modos, sem mudar a paleta, tipografia, grades ou textos
de validação, nem adicionar biblioteca de componentes.

## Principais alterações

- Classes `botao`, `botao--primario` e `botao--secundario` para button e Link,
  com alvo mínimo de 44×44px, foco visível e estados disabled/selecionado.
- Campos e checkboxes compartilham estilos, borda de erro e associações ARIA.
- Componente `Mensagem` para erro, sucesso e aviso com tipo visível por texto,
  regiões vivas apropriadas e opção para evitar anúncios duplicados.
- Remoção dos estilos concorrentes dos botões e preservação do foco nas
  confirmações, resumos de erro, menu e diálogos existentes.
- Atualização da branch para `c360bf8` de develop, preservando a edição e a
  trilha de navegação do grupo. DetalheLocal e EditarLocal adotam o padrão
  porque também usavam as classes globais removidas; nenhuma regra CRUD foi alterada.
- Testes unitários do componente real e das cores reais do CSS, roteiro de
  navegador e evidências antes/depois nos três modos.

### Exemplos para as próximas demandas

```tsx
<button type="submit" className="botao botao--primario">Cadastrar local</button>
<button type="button" className="botao botao--secundario" onClick={limpar}>Limpar filtros</button>
<Link to="/cadastrar" className="botao botao--primario">Cadastrar local</Link>
```

```tsx
<label htmlFor="busca" className="campo-rotulo">Buscar local</label>
<input id="busca" className="campo" aria-invalid={!!erro}
  aria-describedby={erro ? "busca-erro" : undefined} />
{erro && <Mensagem id="busca-erro" tipo="erro" variante="campo" anunciar={false}>
  {erro}
</Mensagem>}
```

```tsx
import Mensagem from "../../components/Mensagem";

<Mensagem tipo="erro">Não foi possível carregar os locais.</Mensagem>
<Mensagem tipo="sucesso">Local excluído com sucesso.</Mensagem>
<Mensagem tipo="aviso">Exibindo dados de reserva.</Mensagem>
```

Mensagens assíncronas podem ficar montadas com conteúdo `""` até a atualização.
Erro usa `alert/assertive`; sucesso e aviso usam `status/polite`. Use
`anunciar={false}` nos erros associados aos campos e nas confirmações já
anunciadas pelo foco. O guia completo está em
[docs/cp2/padroes-interface.md](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/feature/80-padronizar-botoes-campos-mensagens/docs/cp2/padroes-interface.md).

## Como testar

1. Com Node >=22.22, executar `npm ci`, `npm run lint`, `npm run build` e `npm test`.
2. Executar `npm run dev`. Em Cadastro, enviar vazio: conferir resumo focado,
   erros por campo, bordas e links de correção. Preencher os dados válidos e
   cadastrar: conferir confirmação focada e ação de cadastrar outro local.
3. Em Locais, conferir busca/filtros/limpeza, estados vazios e aviso de reserva;
   testar nova tentativa pelo teclado e confirmação de exclusão. Em edição,
   conferir validação, cancelar e salvar sem mudar o ID.
4. Conferir claro, escuro pelo sistema e alto contraste pelo Header. Testar
   fontes, disabled, Tab/Shift+Tab, menu mobile com Enter/Escape e foco visível.
5. Para reproduzir a automação de navegador com Playwright já disponível,
   seguir `docs/cp2/issue-80/browser-README.md`. O roteiro usa a fixture de teste,
   não altera dependências e não está incluído em `npm test`.

## Critérios de aceite

- [x] Botões primários e secundários têm a mesma aparência em todas as páginas.
- [x] Botões e links com aparência de botão têm alvo de pelo menos 44 por 44 pixels.
- [x] Os campos de texto, seleção e área de texto têm o mesmo estilo de borda, foco e erro.
- [x] As mensagens de erro, sucesso e aviso usam o componente `Mensagem`.
- [x] O tipo da mensagem é comunicado por texto, e não apenas por cor.
- [x] Texto e destaque atendem a 4,5:1 nos modos claro, escuro e alto contraste, inclusive no botão "Cadastrar local".
- [x] Nenhum botão ou campo usa cor fixa que deveria acompanhar o tema.
- [x] Pelo menos 2 commits autorais e relevantes do responsável.
- [x] `npm run lint`, `npm run build` e `npm test` terminam sem erros.
- [ ] O Pull Request foi revisado antes do merge em `develop`.

Conferência por código, testes automatizados, medições e inspeção das imagens;
revisão técnica e decisão do QA são independentes e permanecem pendentes.

## Verificações do autor

- [x] Minha branch foi criada a partir da versão atualizada de `develop` e atualizada novamente antes do PR.
- [x] Não alterei arquivos que não pertencem à demanda sem justificar.
- [x] Executei `npm run lint`.
- [x] Executei `npm run build`.
- [x] Testei o caminho principal da funcionalidade.
- [x] Testei pelo menos um cenário de erro, quando aplicável.
- [x] Revisei teclado, foco, rótulos e textos alternativos aplicáveis.
- [x] Não enviei senha, token, arquivo `.env` ou dado pessoal indevido.
- [x] Atualizei a documentação necessária.

## Evidências

- Lint e build concluídos; `npm test`: **78 testes, 78 aprovados, zero falhas**.
- Navegador nos três modos: **543 medições de contraste (mínimo 5,45:1)**,
  **177 ocorrências de alvos (mínimo 44×44px)**, 21 focos, 51 bordas de erro e
  12 verificações de viewport; zero erros JavaScript. Controles repetidos em
  contextos/temas diferentes estão incluídos nas contagens.
- "Cadastrar local": **7,10:1 no claro**, **6,77:1 no escuro** e **19,56:1 no alto contraste**.
  A develop recebida já usava texto preto: o defeito atual era 2,96:1 no claro.
- 15 capturas antes e 30 depois, logs e cores/geometrias efetivas em
  [docs/cp2/issue-80](https://github.com/1TDSPJ-26/portal-locais-acessiveis/tree/feature/80-padronizar-botoes-campos-mensagens/docs/cp2/issue-80).
- Índice comparativo e medição do botão em
  [README da Issue](https://github.com/1TDSPJ-26/portal-locais-acessiveis/blob/feature/80-padronizar-botoes-campos-mensagens/docs/cp2/issue-80/README.md).

### Exemplo visual — escuro

Antes:

![Botões e confirmação antes](https://raw.githubusercontent.com/1TDSPJ-26/portal-locais-acessiveis/feature/80-padronizar-botoes-campos-mensagens/docs/cp2/issue-80/antes/escuro-cadastro-sucesso.png)

Depois:

![Botões e confirmação depois](https://raw.githubusercontent.com/1TDSPJ-26/portal-locais-acessiveis/feature/80-padronizar-botoes-campos-mensagens/docs/cp2/issue-80/depois/escuro-cadastro-sucesso.png)

## Riscos e limitações conhecidas

- Confirmar QA, squad, esforço e prazo no Project com o Tech Lead; as caixas
  administrativas estavam desmarcadas. O responsável informou liberação do Tiago.
- Código compartilhado por cadastro/listagem/edição pode conflitar com outras
  demandas. Coordenar o merge com o Tech Lead e executar CI após novas atualizações.
- A automação verificou ARIA e anúncios pelo DOM; teste com leitor de tela real
  permanece a cargo do QA. Não se trata de auditoria de toda a aplicação.
- A baseline foi capturada em `157038e`. As áreas fotografadas não sofreram
  mudanças no upstream até `c360bf8`; o código final incorpora essa nova base.
- Sem push direto em develop, sem force push e sem merge feito pelo autor.

## Autoria e colaboração

- Responsável principal: @EUGP2.
- Implementação, documentação, revisão inicial e testes assistidos pelo Codex.
- Sem outros coautores humanos nesta demanda.
- Dois commits de evolução real: padrão reutilizável/campos/testes e aplicação
  nas telas/compatibilidade/evidências. Revisão técnica humana e QA pendentes.

## Revisão técnica

Preenchimento do Tech Lead ou revisor autorizado.

- [ ] Escopo conferido
- [ ] Código revisado
- [ ] Build aprovado
- [ ] Pronto para o QA

Observações: revisão inicial assistida não substitui a aprovação do revisor autorizado.

## Decisão do QA

- [ ] Aprovado
- [ ] Aprovado com ressalva
- [ ] Reprovado
- [ ] Bloqueado

Issue do ciclo de teste: a definir pelo QA.
