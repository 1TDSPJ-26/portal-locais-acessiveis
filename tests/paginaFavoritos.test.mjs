import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { transpileModule, JsxEmit, ModuleKind } from "typescript";

// Compila os componentes reais em memória, como nos testes de Mensagem.
const modulos = new Map();
function compilar(caminho) {
  const arquivo = new URL(caminho, import.meta.url);
  if (modulos.has(arquivo.href)) return modulos.get(arquivo.href);
  const { outputText } = transpileModule(readFileSync(arquivo, "utf8"), {
    compilerOptions: { jsx: JsxEmit.ReactJSX, module: ModuleKind.ESNext },
  });
  const codigo = outputText.replace(/from "([^"]+)"/g, (_, modulo) => {
    let destino;
    if (modulo.startsWith(".")) {
      const base = new URL(modulo, arquivo);
      const fonte = [base, new URL(`${base.href}.ts`), new URL(`${base.href}.tsx`), new URL(`${base.href}/index.tsx`)]
        .find((candidato) => existsSync(candidato) && /\.tsx?$/.test(candidato.pathname));
      if (!fonte) throw new Error(`Importação não encontrada: ${modulo}`);
      destino = compilar(fonte.href);
    } else {
      destino = import.meta.resolve(modulo);
    }
    return `from ${JSON.stringify(destino)}`;
  });
  const url = `data:text/javascript;base64,${Buffer.from(codigo).toString("base64")}`;
  modulos.set(arquivo.href, url);
  return url;
}

const { default: Favoritos } = await import(compilar("../src/pages/Favoritos/index.tsx"));
const { LocaisContext } = await import(compilar("../src/LocaisContext.ts"));
const { FavoritosContext } = await import(compilar("../src/FavoritosContext.ts"));
const { Header } = await import(compilar("../src/components/Header/index.tsx"));
const { PreferenciasContext } = await import(compilar("../src/PreferenciasContext.tsx"));

const locais = [
  { id: 3, nome: "Zoológico", categoria: "Lazer", endereco: "Rua Z, 3", recursos: [] },
  { id: 1, nome: "Árvore Cultural", categoria: "Cultura", endereco: "Rua A, 1", recursos: ["Libras"] },
  { id: 2, nome: "Biblioteca", categoria: "Cultura", endereco: "Rua B, 2", recursos: [] },
];

function renderizar({ ids = [3, 1], estado = "pronto", usandoReserva = false } = {}) {
  return renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: ["/favoritos"] },
    createElement(LocaisContext.Provider, { value: { locais, estado, usandoReserva, tentarNovamente() {} } },
      createElement(FavoritosContext.Provider, { value: { ehFavorito: (id) => ids.includes(id), alternarFavorito() {} } },
        createElement(Favoritos),
      ),
    ),
  ));
}

test("favoritos lista somente os selecionados em ordem alfabética e sem alterar os locais", () => {
  const antes = structuredClone(locais);
  const html = renderizar();
  assert.equal((html.match(/class="place-card"/g) ?? []).length, 2);
  assert(html.indexOf("Árvore Cultural</a>") < html.indexOf("Zoológico</a>"));
  assert.doesNotMatch(html, /Biblioteca/);
  assert.match(html, /2 locais favoritos/);
  assert.deepEqual(locais, antes);
});

test("a página define título, h1 e quantidade no singular", () => {
  const html = renderizar({ ids: [1] });
  assert.match(html, /<title>Favoritos \| Portal de Locais e Serviços Acessíveis<\/title>/);
  assert.match(html, /<h1>Meus favoritos<\/h1>/);
  assert.match(html, /1 local favorito/);
});

test("sem favoritos mostra somente uma mensagem simples e a quantidade zero", () => {
  const html = renderizar({ ids: [] });
  assert.match(html, /0 locais favoritos/);
  assert.match(html, /Você ainda não tem locais favoritos nesta lista\./);
  assert.doesNotMatch(html, /class="place-card"/);
});

test("mantém o título focável e a região de anúncio mesmo sem cartões", () => {
  const html = renderizar({ ids: [] });
  assert.match(html, /<h2 id="titulo-lista-favoritos" tabindex="-1">0 locais favoritos<\/h2>/);
  assert.match(html, /class="mensagem mensagem--sucesso mensagem--painel delete-notice" role="status" aria-live="polite" aria-atomic="true"><\/div>/);
});

test("durante a carga não mostra cartões, quantidade provisória nem estado vazio", () => {
  const html = renderizar({ estado: "carregando" });
  assert.match(html, /aria-live="polite"[^>]*>Carregando locais\.\.\.<\/output>/);
  assert.doesNotMatch(html, /class="place-card"|ainda não tem|2 locais favoritos/);
});

test("o erro tem mensagem acessível e ação de tentar novamente, sem cartões antigos", () => {
  const html = renderizar({ estado: "erro" });
  assert.match(html, /role="alert"/);
  assert.match(html, /Não foi possível carregar os locais/);
  assert.match(html, />Tentar novamente<\/button>/);
  assert.doesNotMatch(html, /class="place-card"|ainda não tem/);
});

test("a reserva avisa da falha, permite tentar novamente e conta somente os cartões disponíveis", () => {
  const html = renderizar({ ids: [1, 999], usandoReserva: true });
  assert.match(html, /Exibindo dados de reserva/);
  assert.match(html, />Tentar novamente<\/button>/);
  assert.match(html, /1 local favorito/);
  assert.equal((html.match(/class="place-card"/g) ?? []).length, 1);
  assert.doesNotMatch(html, /Zoológico|Biblioteca/);
});

test("o menu inclui Favoritos e destaca o link somente na sua rota", () => {
  for (const rota of ["/favoritos", "/locais"]) {
    const html = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [rota] },
      createElement(PreferenciasContext.Provider, { value: { fonte: "normal", contraste: "normal" } },
        createElement(Header),
      ),
    ));
    const link = html.match(/<a\b[^>]*href="\/favoritos"[^>]*>Favoritos<\/a>/)?.[0];
    assert.ok(link, "o link pertence ao mesmo painel usado no desktop e no mobile");
    if (rota === "/favoritos") {
      assert.match(link, /aria-current="page"/);
      assert.match(link, /class="nav-link active"/);
    } else {
      assert.doesNotMatch(link, /aria-current|nav-link active/);
    }
  }
});
