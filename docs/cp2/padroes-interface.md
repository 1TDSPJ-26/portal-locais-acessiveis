# Padrão de botões, campos e mensagens — Issue #80

Use as classes de `src/index.css` para aparência. Mantenha classes de grade,
espaçamento e posicionamento na página. Não acrescente `text-white`, `text-black`,
cores de fundo fixas nem uma segunda borda/foco aos controles.

## Botões e links

```tsx
<button type="submit" className="botao botao--primario" disabled={enviando}>
  Cadastrar local
</button>
<button type="button" className="botao botao--secundario" onClick={limpar}>
  Limpar filtros
</button>
<Link to="/cadastrar" className="botao botao--primario">Cadastrar local</Link>
```

As duas variantes têm alvo mínimo de 44 × 44 pixels, foco visível, estado disabled
com borda tracejada e as mesmas dimensões/bordas em qualquer tela. O primário usa
`--accent` e `--on-accent`; o secundário usa `--card`, `--ink` e `--control`.
Seleção pode ser indicada por `aria-pressed` em botões de alternância.
Links de navegação comuns continuam sendo links, sem aparência de botão.

## Campos

Prefira `TextField`, `SelectField`, `TextAreaField` e `CheckboxField`, que mantêm
rótulo, manipuladores e as relações de acessibilidade. Para um controle simples:

```tsx
<label htmlFor="busca" className="campo-rotulo">Buscar local</label>
<input id="busca" className="campo" aria-invalid={!!erro}
  aria-describedby={erro ? "busca-erro" : undefined} />
{erro && <Mensagem id="busca-erro" tipo="erro" variante="campo" anunciar={false}>
  {erro}
</Mensagem>}
```

`campo` unifica borda, mínimo de 44 pixels de altura, cores e foco. O erro é
acionado por `aria-invalid="true"`, com descrição associada por `aria-describedby`.
Checkboxes usam `campo-checkbox` e `campo-checkbox-label` dentro de
`campo-checkbox-grupo`; o rótulo oferece alvo de toque sem inflar o ícone.

## Mensagens

```tsx
import Mensagem from "../../components/Mensagem";

<Mensagem tipo="erro"><h2>Não foi possível carregar os locais</h2>
  <p>Tente novamente para consultar os locais disponíveis.</p>
  <button type="button" className="botao botao--secundario" onClick={tentarNovamente}>
    Tentar novamente
  </button>
</Mensagem>
<Mensagem tipo="sucesso">Local excluído com sucesso.</Mensagem>
<Mensagem tipo="aviso">Exibindo dados de reserva.</Mensagem>
```

- `tipo`: `erro`, `sucesso` ou `aviso`. O rótulo **Erro**, **Sucesso** ou **Aviso**
  é visível; a cor não é o único meio de comunicar o tipo.
- `variante`: `painel` (padrão) ou `campo` (descrição compacta).
- `anunciar`: `true` (padrão). Erro usa `alert`/`assertive`; os demais,
  `status`/`polite`, todos com anúncio atômico. Use `false` em descrições de campo
  e em conteúdo já anunciado por foco/outra região viva, para evitar duplicação.
- Props de `div`, como `id`, `ref`, `tabIndex`, `aria-labelledby` e `className`,
  são repassadas. Não use `role` ou `aria-live` manualmente: o componente os define.
- Para mensagens assíncronas, mantenha a região montada e passe `""` enquanto
  não há mensagem. Ela fica vazia, sem borda/rótulo, até receber conteúdo.
- Os textos originais de validação devem ser preservados dentro do componente.

## Temas e revisão

`--on-accent` tem valor explícito no claro, no escuro e no alto contraste.
O alto contraste não sobrescreve os botões/links `.botao` com a regra genérica.
O foco mantém o contorno duplo já adotado pelo portal, inclusive em forced-colors.

Execute `npm run lint`, `npm run build` e `npm test`. Confira também em navegador
os três modos, teclado, foco, campos inválidos, mensagens e mobile. A suíte
unitária lê as cores reais do CSS e verifica os pares de texto/destaque,
texto/mensagem e borda/campo; a verificação visual não substitui teste com leitor
de tela pelo QA.
