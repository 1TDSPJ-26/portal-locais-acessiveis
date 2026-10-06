import test from "node:test";
import assert from "node:assert/strict";

function converterRgb(valor) {
  valor = valor / 255;

  if (valor <= 0.03928) {
    return valor / 12.92;
  }

  return Math.pow((valor + 0.055) / 1.055, 2.4);
}

function calcularLuminancia(r, g, b) {
  const vermelho = converterRgb(r);
  const verde = converterRgb(g);
  const azul = converterRgb(b);

  return (
    0.2126 * vermelho +
    0.7152 * verde +
    0.0722 * azul
  );
}

function calcularContraste(cor1, cor2) {
  const luminancia1 = calcularLuminancia(...cor1);
  const luminancia2 = calcularLuminancia(...cor2);

  const maisClara = Math.max(luminancia1, luminancia2);
  const maisEscura = Math.min(luminancia1, luminancia2);

  return (maisClara + 0.05) / (maisEscura + 0.05);
}

test("deve possuir contraste mínimo de 4.5:1", () => {
  const corTexto = [255, 255, 255];
  const corFundo = [0, 0, 0];

  const contraste = calcularContraste(corTexto, corFundo);

  assert.ok(contraste >= 4.5);
});