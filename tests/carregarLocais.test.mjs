import assert from "node:assert/strict";
import { test } from "node:test";
import { carregarLocais } from "../src/services/locais.ts";
import { locais } from "../src/data/locais.ts";
import { CHAVE_LOCAIS } from "../src/persistenciaLocais.ts";

test("carrega os locais de exemplo somente depois do atraso simulado", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let concluido = false;
  const carga = carregarLocais().then((dados) => {
    concluido = true;
    return dados;
  });

  assert.ok(carga instanceof Promise);
  t.mock.timers.tick(499);
  await Promise.resolve();
  assert.equal(concluido, false);

  t.mock.timers.tick(1);
  assert.deepEqual(await carga, locais);
  assert.equal(concluido, true);
});

test("alterar uma carga não modifica os dados de exemplo nem a próxima carga", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const primeiraCarga = carregarLocais();
  t.mock.timers.tick(500);
  const primeiraLista = await primeiraCarga;
  const nomeOriginal = locais[0].nome;
  const recursosOriginais = [...locais[0].recursos];

  primeiraLista[0].nome = "Nome modificado";
  primeiraLista[0].recursos.length = 0;
  primeiraLista.pop();

  assert.equal(locais[0].nome, nomeOriginal);
  assert.deepEqual(locais[0].recursos, recursosOriginais);

  const segundaCarga = carregarLocais();
  t.mock.timers.tick(500);
  assert.deepEqual(await segundaCarga, locais);
});

test("cargas simultâneas devolvem listas e recursos independentes", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const cargas = [carregarLocais(), carregarLocais()];
  t.mock.timers.tick(500);
  const [primeira, segunda] = await Promise.all(cargas);

  assert.deepEqual(primeira, segunda);
  assert.notEqual(primeira, segunda);
  assert.notEqual(primeira[0], segunda[0]);
  assert.notEqual(primeira[0].recursos, segunda[0].recursos);
});

test("usa a lista salva no armazenamento em vez dos dados de exemplo", async (t) => {
  const salvos = [
    {
      id: 42,
      nome: "Local cadastrado pelo usuário",
      categoria: "Cultura",
      endereco: "Rua Exemplo, 10 · Centro",
      recursos: ["Piso tátil"],
    },
  ];
  globalThis.localStorage = {
    getItem: (chave) =>
      chave === CHAVE_LOCAIS ? JSON.stringify(salvos) : null,
    setItem() {},
  };
  t.after(() => {
    delete globalThis.localStorage;
  });

  t.mock.timers.enable({ apis: ["setTimeout"] });
  const carga = carregarLocais();
  t.mock.timers.tick(500);

  assert.deepEqual(await carga, salvos);
});
