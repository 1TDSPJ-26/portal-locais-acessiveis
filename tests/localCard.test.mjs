import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { transpileModule, JsxEmit, ModuleKind } from "typescript";

const modulos = new Map();

function compilar(caminho) {
  const arquivo = new URL(caminho, import.meta.url);
  if (modulos.has(arquivo.href)) return modulos.get(arquivo.href);

  const { outputText } = transpileModule(readFileSync(arquivo, "utf8"), {
    compilerOptions: { jsx: JsxEmit.ReactJSX, module: ModuleKind.ESNext },
  });
  const codigo = outputText.replace(/from "([^"]+)"/g, (_, modulo) => {
    if (!modulo.startsWith(".")) return `from ${JSON.stringify(import.meta.resolve(modulo))}`;

    const base = new URL(modulo, arquivo);
    const fonte = [base, new URL(`${base.href}.ts`), new URL(`${base.href}.tsx`), new URL(`${base.href}/index.tsx`)]
      .find((candidato) => existsSync(candidato) && /\.tsx?$/.test(candidato.pathname));
    if (!fonte) throw new Error(`Importação não encontrada: ${modulo}`);
    return `from ${JSON.stringify(compilar(fonte.href))}`;
  });
  const url = `data:text/javascript;base64,${Buffer.from(codigo).toString("base64")}`;
  modulos.set(arquivo.href, url);
  return url;
}

const { LocalCard } = await import(compilar("../src/components/LocalCard/index.tsx"));
const { FavoritosContext } = await import(compilar("../src/FavoritosContext.ts"));
const { LocalizacaoContext } = await import(compilar("../src/LocalizacaoContext.ts"));
const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

const local = {
  id: 42,
  nome: "Biblioteca Inclusiva",
  categoria: "Cultura",
  endereco: "Rua do Acesso, 42",
  recursos: ["Libras", "Piso tátil"],
};

function renderizar({ local: localCartao = local, posicao = null } = {}) {
  return renderToStaticMarkup(
    createElement(MemoryRouter, { initialEntries: ["/locais?busca=biblioteca"] },
      createElement(LocalizacaoContext.Provider, {
        value: {
          estado: posicao ? "obtida" : "inativo",
          posicao,
          erro: null,
          solicitar() {},
        },
      },
        createElement(FavoritosContext.Provider, {
          value: { favoritos: [], ehFavorito: () => false, alternarFavorito() {}, totalFavoritos: 0 },
        }, createElement(LocalCard, { local: localCartao })),
      ),
    ),
  );
}

test("organiza categoria, nome, ações, endereço e recursos no cartão", () => {
  const html = renderizar();

  assert.match(html, /^<article class="place-card">/);
  assert.match(html, /class="place-category">Cultura<\/span>/);
  assert.match(html, /class="place-card-actions"><button/);
  assert.match(html, /class="place-address">Rua do Acesso, 42<\/p>/);
  assert.match(html, /<ul class="place-resources" aria-labelledby="recursos-local-42">/);
  assert.equal((html.match(/<li>/g) ?? []).length, 2);
});

test("usa somente o nome como conteúdo do link e mantém o botão fora dele", () => {
  const html = renderizar();
  const link = html.match(/<a class="place-card-link"[^>]*>(.*?)<\/a>/);

  assert.ok(link);
  assert.equal(link[1], local.nome);
  assert.doesNotMatch(link[0], /<button/);
  assert.doesNotMatch(html, /<article[^>]+aria-(?:label|labelledby)/);
  assert.equal((html.match(/<a /g) ?? []).length, 1);
});
test("não mostra distância quando não há posição", () => {
  const html = renderizar({ local: { ...local, latitude: -23.547, longitude: -46.629 } });

  assert.doesNotMatch(html, /place-distance/);
});

test("mostra a distância aproximada, com unidade por extenso para leitor de tela", () => {
  const html = renderizar({
    local: { ...local, latitude: -23.5505, longitude: -46.6333 },
    posicao: { latitude: -23.547, longitude: -46.629 },
  });

  assert.match(html, /<span aria-hidden="true">Aproximadamente 600 m<\/span>/);
  assert.match(html, /<span class="sr-only">Aproximadamente 600 metros<\/span>/);
});

test("mostra Distância indisponível quando o local não tem coordenadas", () => {
  const html = renderizar({ posicao: { latitude: -23.547, longitude: -46.629 } });

  assert.match(html, /class="place-distance">Distância indisponível<\/p>/);
});

test("define uma, duas e três colunas nos breakpoints escolhidos", () => {
  assert.match(css, /\.places-grid\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/s);
  assert.match(css, /@media \(min-width:\s*48rem\)\s*\{\s*\.places-grid\s*\{[^}]*repeat\(2, minmax\(0, 1fr\)\)/s);
  assert.match(css, /@media \(min-width:\s*64rem\)\s*\{\s*\.places-grid\s*\{[^}]*repeat\(3, minmax\(0, 1fr\)\)/s);
});

test("estende o link pelo cartão sem cobrir a ação de favorito", () => {
  assert.match(css, /\.place-card\s*\{[^}]*position:\s*relative/s);
  assert.match(css, /\.place-card-link::after\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0[^}]*z-index:\s*1/s);
  assert.match(css, /\.place-card-actions \.botao\s*\{[^}]*position:\s*relative[^}]*z-index:\s*2/s);
});

test("destaca o cartão completo quando o link recebe foco", () => {
  assert.match(css, /\.place-card:has\(\.place-card-link:focus-visible\)\s*\{[^}]*outline:/s);
  assert.match(css, /\.place-card-link:focus-visible\s*\{[^}]*outline:\s*none/s);
});

test("usa os tokens da identidade visual no cartão e nas etiquetas", () => {
  const regrasCartao = css.match(/\/\* Issue #161[\s\S]+?@media \(min-width: 48rem\)/)?.[0] ?? "";

  for (const token of ["--espaco-2", "--espaco-3", "--espaco-4", "--espaco-5", "--texto-sm", "--texto-base", "--texto-xl", "--raio-lg"]) {
    assert.match(regrasCartao, new RegExp(`var\\(${token}\\)`), `${token} deve ser usado`);
  }
});
