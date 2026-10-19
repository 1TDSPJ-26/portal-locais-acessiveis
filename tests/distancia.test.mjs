import assert from "node:assert/strict";
import test from "node:test";
import { calcularDistanciaKm } from "../src/utils/distancia.ts";

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
