import assert from "node:assert/strict";
import { test } from "node:test";
import { carregarComReserva } from "../src/services/locais.ts";
import { locais } from "../src/data/locais.ts";

test("retorna os locais carregados sem usar a reserva", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  const salvos = [{ ...locais[0], id: 85, nome: "Local salvo" }];

  const resultado = await carregarComReserva(() => Promise.resolve(salvos), locais);

  assert.deepEqual(resultado, { locais: salvos, usandoReserva: false });
  assert.equal(log.mock.callCount(), 0);
});

test("usa a reserva e registra a causa quando a Promise rejeita", async (t) => {
  const log = t.mock.method(console, "error", () => {});
  const erro = new Error("Falha simulada");

  const resultado = await carregarComReserva(() => Promise.reject(erro), locais);

  assert.deepEqual(resultado, { locais, usandoReserva: true });
  assert.equal(log.mock.callCount(), 1);
  assert.equal(log.mock.calls[0].arguments[1], erro);
});

test("uma lista vazia carregada com sucesso não aciona a reserva", async () => {
  const resultado = await carregarComReserva(() => Promise.resolve([]), locais);

  assert.deepEqual(resultado, { locais: [], usandoReserva: false });
});

test("alterar a reserva retornada não modifica os dados originais", async (t) => {
  t.mock.method(console, "error", () => {});
  const original = structuredClone(locais);
  const resultado = await carregarComReserva(
    () => Promise.reject(new Error("Falha simulada")),
    locais,
  );

  resultado.locais[0].nome = "Nome alterado";
  resultado.locais[0].recursos.length = 0;
  resultado.locais.pop();

  assert.deepEqual(locais, original);
});

test("propaga a falha quando nem a reserva pode ser usada", async (t) => {
  t.mock.method(console, "error", () => {});
  const erroReserva = new Error("Reserva indisponível");
  const reserva = [{
    ...locais[0],
    get recursos() { throw erroReserva; },
  }];

  await assert.rejects(
    carregarComReserva(() => Promise.reject(new Error("Falha na carga")), reserva),
    (erro) => erro === erroReserva,
  );
});
