
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  carregarComReserva,
  carregarLocais,
} from "../src/services/locais.ts";
import { locais } from "../src/data/locais.ts";
import { CHAVE_LOCAIS } from "../src/persistenciaLocais.ts";

test("usa os dados de reserva quando o JSON salvo é inválido", async (t) => {
  const armazenamentoOriginal = globalThis.localStorage;

  globalThis.localStorage = {
    getItem(chave) {
      assert.equal(chave, CHAVE_LOCAIS);
      return "{json inválido";
    },
  };

  t.after(() => {
    if (armazenamentoOriginal === undefined) {
      delete globalThis.localStorage;
    } else {
      globalThis.localStorage = armazenamentoOriginal;
    }
  });

  t.mock.method(console, "error", () => {});

  const resultado = await carregarComReserva(
    carregarLocais,
    locais,
  );

  assert.equal(resultado.usandoReserva, true);
  assert.deepEqual(resultado.locais, locais);
});
