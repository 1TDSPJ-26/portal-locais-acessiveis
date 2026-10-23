import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
    obterConfirmacaoDoEstado,
    removerConfirmacaoDoEstado,
} from "../src/utils/confirmacao-da-navegacao.ts";

const ler = (caminho) => readFileSync(new URL(`../${caminho}`, import.meta.url), "utf8");


test("a confirmação da edição é lida do state enviado pela tela de edição", () => {
    const estado = {
        confirmacao: "Biblioteca Parque foi atualizado com sucesso.",
        origemListagem: "/locais?busca=biblioteca",
    };

    assert.equal(obterConfirmacaoDoEstado(estado), "Biblioteca Parque foi atualizado com sucesso.");
});

test("a confirmação da exclusão é lida do state enviado pelo detalhe", () => {
    const estado = { confirmacao: "Local Biblioteca Parque excluído com sucesso." };

    assert.equal(obterConfirmacaoDoEstado(estado), "Local Biblioteca Parque excluído com sucesso.");
    assert.equal(removerConfirmacaoDoEstado(estado), null);
});

test("após remover a confirmação, voltar ou recarregar não encontra mais mensagem", () => {
    const estado = { confirmacao: "Salvo.", origemListagem: "/locais?categoria=Cultura" };
    const estadoDoHistorico = removerConfirmacaoDoEstado(estado);

    assert.equal(obterConfirmacaoDoEstado(estadoDoHistorico), null);
    assert.deepEqual(estadoDoHistorico, { origemListagem: "/locais?categoria=Cultura" });
});

test("remover a confirmação não altera o objeto original", () => {
    const estado = { confirmacao: "Salvo.", retornoDaListagem: true };

    removerConfirmacaoDoEstado(estado);

    assert.deepEqual(estado, { confirmacao: "Salvo.", retornoDaListagem: true });
});

test("valores que não são texto útil não geram confirmação", () => {
    for (const estado of [undefined, null, "texto", 42, {}, { confirmacao: "" }, { confirmacao: "   " }, { confirmacao: 7 }]) {
        assert.equal(obterConfirmacaoDoEstado(estado), null);
    }
});

test("edição e exclusão usam o mesmo componente MensagemConfirmacao", () => {
    assert.match(ler("src/pages/DetalheLocal/index.tsx"), /<MensagemConfirmacao\s*\/>/);
    assert.match(ler("src/pages/Locais/index.tsx"), /<MensagemConfirmacao\s*\/>/);
});

test("a listagem não usa mais atraso fixo nem a chave localExcluido", () => {
    const listagem = ler("src/pages/Locais/index.tsx");

    assert.doesNotMatch(listagem, /setTimeout/);
    assert.doesNotMatch(listagem, /localExcluido/);
    assert.doesNotMatch(ler("src/pages/DetalheLocal/index.tsx"), /localExcluido/);
});

test("as telas enviam a mensagem na chave confirmacao do state", () => {
    assert.match(ler("src/pages/EditarLocal/index.tsx"), /state:\s*\{\s*confirmacao:/);
    assert.match(ler("src/pages/DetalheLocal/index.tsx"), /state:\s*\{\s*confirmacao:/);
});

test("a região viva existe antes do texto: o componente é sempre renderizado", () => {
    const componente = ler("src/components/MensagemConfirmacao/index.tsx");

    assert.match(componente, /return\s*\(\s*<Mensagem\s+tipo="sucesso"/);
    assert.doesNotMatch(componente, /confirmacao\s*&&\s*</);
});
