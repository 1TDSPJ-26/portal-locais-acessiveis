import assert from "node:assert/strict";
import { test } from "node:test";
import {
  obterOrigemListagem,
  origemListagemPadrao,
} from "../src/utils/origem-listagem.ts";

test("recupera a origem da listagem com os parâmetros ativos", () => {
  assert.deepEqual(
    obterOrigemListagem({
      origemListagem: { pathname: "/locais", search: "?busca=biblioteca&ordem=categoria&pagina=2" },
    }),
    { pathname: "/locais", search: "?busca=biblioteca&ordem=categoria&pagina=2" },
  );
});

test("usa a listagem padrão para origem ausente ou inválida", () => {
  assert.deepEqual(obterOrigemListagem(null), origemListagemPadrao);
  assert.deepEqual(
    obterOrigemListagem({ origemListagem: { pathname: "/outra-pagina", search: "?pagina=2" } }),
    origemListagemPadrao,
  );
});
