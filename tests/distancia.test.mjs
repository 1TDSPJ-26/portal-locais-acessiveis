import assert from "node:assert/strict";
import test from "node:test";
import {
    calcularDistanciaKm,
    formatarDistancia,
    formatarDistanciaPorExtenso,
} from "../src/utils/distancia.ts";

const pracaDaSe = { latitude: -23.5505, longitude: -46.6333 };
const centroRio = { latitude: -22.9068, longitude: -43.1729 };

test("calcula a distância entre São Paulo e Rio (~361 km)", () => {
    const km = calcularDistanciaKm(pracaDaSe, centroRio);

    assert.ok(
        Math.abs(km - 360.75) < 1,
        `Esperado ~360,75 km, veio ${km}`,
    );
});

test("retorna 0 para o mesmo ponto", () => {
    assert.equal(calcularDistanciaKm(pracaDaSe, pracaDaSe), 0);
});

test("a ida e a volta dão a mesma distância", () => {
    assert.equal(
        calcularDistanciaKm(pracaDaSe, centroRio),
        calcularDistanciaKm(centroRio, pracaDaSe),
    );
});

test("formatarDistancia: abaixo de 1 km usa metros de 50 em 50", () => {
    assert.equal(formatarDistancia(0), "0 m");
    assert.equal(formatarDistancia(0.85), "850 m");
    assert.equal(formatarDistancia(0.87), "850 m");
    assert.equal(formatarDistancia(0.88), "900 m");
});

test("formatarDistancia: a partir de 1 km usa uma casa decimal com vírgula", () => {
    assert.equal(formatarDistancia(1.24), "1,2 km");
    assert.equal(formatarDistancia(2), "2,0 km");
    assert.equal(formatarDistancia(12.5), "12,5 km");
});

test("formatarDistancia: arredondamento que chega a 1000 m vira km", () => {
    assert.equal(formatarDistancia(0.9996), "1,0 km");
});

test("formatarDistanciaPorExtenso: escreve a unidade por extenso", () => {
    assert.equal(formatarDistanciaPorExtenso(0.85), "850 metros");
    assert.equal(formatarDistanciaPorExtenso(1.24), "1,2 quilômetro");
    assert.equal(formatarDistanciaPorExtenso(12.5), "12,5 quilômetros");
});