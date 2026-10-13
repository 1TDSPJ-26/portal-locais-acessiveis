import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");

const luminancia = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contraste = (a, b) => {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
};

/* Lê o valor de um token dentro do bloco que começa em `abertura`. */
const token = (abertura, nome) => {
  const inicio = css.indexOf(abertura);
  assert.notEqual(inicio, -1, `bloco não encontrado: ${abertura}`);
  const bloco = css.slice(inicio, css.indexOf("}", inicio));
  const achado = bloco.match(new RegExp(`${nome}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(achado, `${nome} não definido em ${abertura}`);
  return achado[1];
};

const modos = [
  ["tema claro", ":root {"],
  ["tema escuro do sistema", "@media (prefers-color-scheme: dark) {"],
  ["alto contraste", ':root[data-contraste="alto"] {'],
];

for (const [nome, abertura] of modos) {
  test(`--hero-ink tem contraste mínimo de 4.5:1 com --hero no ${nome}`, () => {
    const razao = contraste(token(abertura, "--hero-ink"), token(abertura, "--hero"));
    assert.ok(razao >= 4.5, `contraste ${razao.toFixed(2)}:1`);
  });
}

test("o título da Home (h2 do home-hero) usa o token --hero-ink, sem cor escrita no valor", () => {
  const estilos = readFileSync(
    new URL("../src/pages/Home/styles.css", import.meta.url),
    "utf8",
  );
  const regra = estilos.match(/\.home-hero\s+h2\s*\{([^}]*)\}/);
  assert.ok(regra, "regra .home-hero h2 não encontrada em Home/styles.css");
  assert.match(regra[1], /color:\s*var\(--hero-ink\)/);
});

