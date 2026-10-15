import test from "node:test";
import assert from "node:assert/strict";
import { calcularDistanciaKm } from "../src/utils/distancia.ts";

test("calcula aproximadamente 111,2 km entre pontos separados por um grau de latitude", () => {
    const origem = { latitude: 0, longitude: 0 };
    const destino = { latitude: 1, longitude: 0 };
    const distancia = calcularDistanciaKm(origem, destino);
    assert.ok(Math.abs(distancia - 111.2) < 0.2);
});

test("calcula a distância entre dois locais com coordenadas diferentes", () => {
    const origem = { latitude: -23.5505, longitude: -46.6333 };
    const destino = { latitude: -23.5680, longitude: -46.6750 };
    const distancia = calcularDistanciaKm(origem, destino);
    assert.ok(distancia > 0);
});