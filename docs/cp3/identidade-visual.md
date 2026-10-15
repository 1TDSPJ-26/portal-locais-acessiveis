# Identidade visual do portal — Issue #157

Fontes e escalas que todas as páginas devem usar. Os tokens ficam em `:root`,
em `src/index.css`, no bloco "Identidade visual". As Issues #158 a #164 usam
esta base; o padrão de botões, campos e mensagens da Issue #80
(`docs/cp2/padroes-interface.md`) continua valendo.

## Fontes

| Uso | Fonte | Token | Alternativas do sistema |
| --- | --- | --- | --- |
| Texto, botões e campos | Atkinson Hyperlegible Next | `--fonte-texto` | Segoe UI, system-ui, sans-serif |
| Títulos (`h1` a `h3`) | Fraunces | `--fonte-titulo` | Georgia, Times New Roman, serif |

- **Atkinson Hyperlegible Next** foi criada pelo Braille Institute para leitores
  com baixa visão: letras parecidas, como `I`, `l` e `1` ou `O` e `0`, têm
  formas bem diferentes entre si.
- **Fraunces** dá personalidade aos títulos. A versão usada tem o eixo de
  tamanho óptico, que ajusta o desenho das letras ao tamanho do título.
- As duas vêm de pacotes npm (`@fontsource-variable/...`), importados em
  `src/main.tsx`. O Vite inclui os arquivos no build: nenhuma fonte é baixada de
  serviço externo, e o portal funciona sem acesso ao Google Fonts.

Não declare `font-family` nos componentes. Texto e campos herdam
`--fonte-texto`, e os títulos já usam `--fonte-titulo`.

## Tipografia

| Token | Valor | Tamanho padrão | Uso sugerido |
| --- | --- | --- | --- |
| `--texto-xs` | `0.75rem` | 12 px | rótulos curtos, como o "kicker" acima do título |
| `--texto-sm` | `0.875rem` | 14 px | rótulos de campo, mensagens de campo, legendas |
| `--texto-base` | `1rem` | 16 px | texto corrido |
| `--texto-lg` | `1.125rem` | 18 px | introdução de página |
| `--texto-xl` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)` | 20 a 24 px | `h3` |
| `--texto-2xl` | `clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem)` | 24 a 36 px | `h2` |
| `--texto-3xl` | `clamp(2rem, 1.4rem + 3vw, 3.5rem)` | 32 a 56 px | `h1` |

| Token | Valor | Uso |
| --- | --- | --- |
| `--entrelinha-titulo` | `1.15` | títulos |
| `--entrelinha-texto` | `1.6` | parágrafos |

Os três maiores usam `clamp(mínimo, preferido, máximo)`: crescem com a largura
da tela, mas nunca ficam abaixo do mínimo nem acima do máximo. A hierarquia de
`h1` a `h3` com esses tokens é aplicada na etapa 2 desta Issue.

## Espaçamento

| Token | Valor | Tamanho padrão |
| --- | --- | --- |
| `--espaco-1` | `0.25rem` | 4 px |
| `--espaco-2` | `0.5rem` | 8 px |
| `--espaco-3` | `0.75rem` | 12 px |
| `--espaco-4` | `1rem` | 16 px |
| `--espaco-5` | `1.5rem` | 24 px |
| `--espaco-6` | `2rem` | 32 px |
| `--espaco-7` | `3rem` | 48 px |
| `--espaco-8` | `4rem` | 64 px |

Use os menores (1 a 3) dentro de componentes, como entre ícone e texto ou
entre rótulo e campo, e os maiores (5 a 8) entre seções da página.

## Raio e largura

| Token | Valor | Uso |
| --- | --- | --- |
| `--raio-sm` | `0.25rem` | etiquetas e elementos pequenos |
| `--raio-md` | `0.375rem` | botões e campos (padrão atual da Issue #80) |
| `--raio-lg` | `0.75rem` | cartões e painéis |
| `--largura-texto` | `65ch` | largura máxima de parágrafos (cerca de 65 letras por linha) |
| `--largura-pagina` | `72.5rem` | largura máxima do conteúdo da página (1160 px) |

## Como usar

No CSS:

```css
.cartao-local {
  padding: var(--espaco-5);
  border-radius: var(--raio-lg);
}

.cartao-local h3 {
  font-size: var(--texto-xl);
  line-height: var(--entrelinha-titulo);
}

.pagina-introducao {
  max-width: var(--largura-texto);
  font-size: var(--texto-lg);
}
```

Nas classes do Tailwind, com a sintaxe de variável entre parênteses:

```tsx
<section className="p-(--espaco-5) rounded-(--raio-lg)">
  <p className="max-w-(--largura-texto) text-(length:--texto-lg)">...</p>
</section>
```

## Regras

- **Use `rem`, nunca `px`, para fonte, espaçamento e raio.** O botão "A+" do
  cabeçalho aumenta o tamanho da raiz em dois degraus (`data-fonte="grande"`,
  112,5%, e `data-fonte="maior"`, 125%); tudo que estiver em `rem` cresce junto,
  e o que estiver em `px` fica parado.
- **Toda `var()` precisa existir em `:root`.** Uma variável inexistente faz o
  navegador descartar a declaração sem mostrar erro. O teste
  `tests/identidade-visual.test.mjs` falha se isso acontecer.
- **Prefira um token a um valor solto.** Se nenhum token servir, avise no Pull
  Request em vez de criar um valor novo no componente.
- **Não crie regras globais em elementos** (`fieldset`, `section`, `h2`) dentro
  das Issues de interface: elas afetam todas as páginas e anulam as classes do
  Tailwind.

## Verificação

`tests/identidade-visual.test.mjs` confere que:

- as escalas de tipografia, espaçamento, raio e largura estão completas;
- tipografia, espaçamento e raio usam `rem`;
- os tamanhos de título usam `clamp()` com limites em `rem`;
- toda `var()` do `index.css` aponta para uma variável definida;
- as fontes vêm dos pacotes do projeto, com alternativas do sistema, e nenhum
  arquivo carrega o Google Fonts.

Capturas de tela antes e depois: `docs/cp3/issue-157/`.

## Próxima etapa (até 21/10)

- contêiner `.pagina` e cabeçalho `.pagina-cabecalho` em todas as rotas;
- hierarquia de `h1` a `h3` com `--texto-3xl`, `--texto-2xl` e `--texto-xl`;
- troca das cores escritas diretamente no `index.css` por tokens;
- contraste de todos os pares de texto e fundo nos três modos, com teste.
