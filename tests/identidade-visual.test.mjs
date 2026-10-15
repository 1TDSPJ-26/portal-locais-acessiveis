import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const main = readFileSync(new URL("../src/main.tsx", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const definidas = Object.fromEntries(
  [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
);

const escalas = {
  tipografia: ["--texto-xs", "--texto-sm", "--texto-base", "--texto-lg", "--texto-xl", "--texto-2xl", "--texto-3xl"],
  espacamento: ["--espaco-1", "--espaco-2", "--espaco-3", "--espaco-4", "--espaco-5", "--espaco-6", "--espaco-7", "--espaco-8"],
  raio: ["--raio-sm", "--raio-md", "--raio-lg"],
  largura: ["--largura-texto", "--largura-pagina"],
};

for (const [nome, tokens] of Object.entries(escalas)) {
  test(`a escala de ${nome} está completa em :root`, () => {
    for (const token of tokens) assert.ok(definidas[token], `${token} não foi definido`);
  });
}

test("tipografia, espaçamento e raio usam rem para acompanhar as preferências de fonte", () => {
  for (const token of [...escalas.tipografia, ...escalas.espacamento, ...escalas.raio]) {
    assert.match(definidas[token], /rem/, `${token}: ${definidas[token]}`);
    assert.doesNotMatch(definidas[token], /px/, `${token} não pode usar px`);
  }
});

test("os tamanhos de título crescem com a tela dentro de limites", () => {
  for (const token of ["--texto-xl", "--texto-2xl", "--texto-3xl"]) {
    assert.match(definidas[token], /^clamp\([\d.]+rem,.+,\s*[\d.]+rem\)$/, `${token}: ${definidas[token]}`);
  }
});

test("toda var() usada no CSS aponta para uma variável definida", () => {
  const usadas = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));
  const faltando = [...usadas].filter((variavel) => !(variavel in definidas));
  assert.deepEqual(faltando, []);
});

test("as fontes vêm de pacotes do projeto, com alternativas do sistema", () => {
  assert.match(main, /import ['"]@fontsource-variable\/atkinson-hyperlegible-next/);
  assert.match(main, /import ['"]@fontsource-variable\/fraunces/);
  assert.match(definidas["--fonte-texto"], /^"Atkinson Hyperlegible Next Variable",.+sans-serif$/);
  assert.match(definidas["--fonte-titulo"], /^"Fraunces Variable",.+serif$/);
  for (const arquivo of [css, html]) assert.doesNotMatch(arquivo, /fonts\.(googleapis|gstatic)\.com/);
});

test("texto e títulos usam os tokens de fonte", () => {
  assert.match(css, /:root\s*\{[^}]*font-family:\s*var\(--fonte-texto\)/);
  assert.match(css, /h1\s*\{[^}]*font-family:\s*var\(--fonte-titulo\)/);
  assert.match(css, /h2,\s*h3\s*\{[^}]*font-family:\s*var\(--fonte-titulo\)/);
});
