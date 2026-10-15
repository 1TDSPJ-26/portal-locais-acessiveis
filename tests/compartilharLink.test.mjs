import assert from "node:assert/strict";
import test from "node:test";
import { compartilharLink } from "../src/utils/compartilhar-link.ts";

const titulo = "Biblioteca Central";
const url = "http://localhost:5173/locais/3";

test("usa o compartilhamento nativo quando navigator.share está disponível", async () => {
  let dadosCompartilhados;
  let clipboardFoiUsado = false;

  const resultado = await compartilharLink(titulo, url, {
    share: async (dados) => {
      dadosCompartilhados = dados;
    },

    writeText: async () => {
      clipboardFoiUsado = true;
    },
  });

  assert.equal(resultado, "compartilhado");

  assert.deepEqual(dadosCompartilhados, {
    title: titulo,
    url,
  });

  assert.equal(clipboardFoiUsado, false);
});

test("retorna cancelado quando o usuário cancela o compartilhamento", async () => {
  const resultado = await compartilharLink(titulo, url, {
    share: async () => {
      const erro = new Error("Compartilhamento cancelado");
      erro.name = "AbortError";

      throw erro;
    },
  });

  assert.equal(resultado, "cancelado");
});

test("retorna falhou quando navigator.share gera um erro", async () => {
  const resultado = await compartilharLink(titulo, url, {
    share: async () => {
      throw new Error("Falha ao compartilhar");
    },
  });

  assert.equal(resultado, "falhou");
});

test("usa o clipboard quando navigator.share não está disponível", async () => {
  let textoCopiado;

  const resultado = await compartilharLink(titulo, url, {
    writeText: async (texto) => {
      textoCopiado = texto;
    },
  });

  assert.equal(resultado, "copiado");
  assert.equal(textoCopiado, url);
});

test("retorna falhou quando o clipboard não consegue copiar", async () => {
  const resultado = await compartilharLink(titulo, url, {
    writeText: async () => {
      throw new Error("Falha ao copiar");
    },
  });

  assert.equal(resultado, "falhou");
});

test("retorna falhou quando nenhuma API está disponível", async () => {
  const resultado = await compartilharLink(titulo, url, {});

  assert.equal(resultado, "falhou");
});