import assert from "node:assert/strict";
import test from "node:test";

import {
    obterConfirmacaoDoEstado,
    removerConfirmacaoDoEstado,
} from "../src/utils/confirmacao-da-navegacao.ts";

test("preserva as demais chaves do state ao remover a confirmação", () => {
    const estado = {
        confirmacao: "Local Biblioteca Central foi atualizado com sucesso.",
        origemListagem: { pathname: "/locais", search: "?busca=biblioteca&ordem=categoria" },
        retornoDaListagem: true,
    };

    assert.equal(obterConfirmacaoDoEstado(estado), "Local Biblioteca Central foi atualizado com sucesso.");
    assert.deepEqual(removerConfirmacaoDoEstado(estado), {
        origemListagem: { pathname: "/locais", search: "?busca=biblioteca&ordem=categoria" },
        retornoDaListagem: true,
    });
    assert.equal(removerConfirmacaoDoEstado(null), null);
});
