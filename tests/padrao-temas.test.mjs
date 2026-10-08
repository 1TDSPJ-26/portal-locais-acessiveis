import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/index.css", import.meta.url), "utf8");
const temas = [...css.matchAll(/:root(?:\[data-contraste="alto"\])?\s*\{([^}]+)\}/g)]
  .map((match) => Object.fromEntries([...match[1].matchAll(/(--[\w-]+):\s*(#[\da-f]{6});/gi)].map((cor) => [cor[1], cor[2]])))
  .filter((tema) => tema["--accent"]);

function luminancia(hex) {
  const rgb = hex.slice(1).match(/.{2}/g).map((canal) => {
    const valor = parseInt(canal, 16) / 255;
    return valor <= 0.04045 ? valor / 12.92 : ((valor + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contraste(a, b) {
  const valores = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (valores[0] + 0.05) / (valores[1] + 0.05);
}

test("on-accent está definido explicitamente no claro, escuro e alto contraste", () => {
  assert.equal(temas.length, 3);
  for (const tema of temas) assert.ok(tema["--on-accent"]);
});

for (const [indice, nome] of ["claro", "escuro", "alto contraste"].entries()) {
  test(`texto sobre destaque e mensagens têm contraste mínimo 4,5:1 no modo ${nome}`, () => {
    const tema = temas[indice];
    for (const [texto, fundo] of [["--on-accent", "--accent"], ["--ink", "--card"], ["--accent", "--card"], ["--alert", "--card"]]) {
      const razao = contraste(tema[texto], tema[fundo]);
      assert.ok(razao >= 4.5, `${texto}/${fundo}: ${razao.toFixed(2)}:1`);
    }
    assert.ok(contraste(tema["--control"], tema["--card"]) >= 3, "borda do campo deve ser distinguível");
  });
}

test("botões, badges e seleção não fixam branco sobre o destaque", () => {
  assert.match(css, /\.botao--primario\s*\{[^}]*color:\s*var\(--on-accent\)/);
  assert.match(css, /\.filter-count\s*\{[^}]*color:\s*var\(--on-accent\)/);
  assert.match(css, /input:checked\s*\+\s*\.custom-check\s*\{[^}]*color:\s*var\(--on-accent\)/);
});
