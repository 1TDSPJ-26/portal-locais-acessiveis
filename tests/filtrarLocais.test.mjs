import assert from "node:assert/strict";
import { test } from "node:test";
import { filtrarLocais } from "../src/utils/filtrar-locais.ts";

const locais = [
    { id: 1, nome: "Biblioteca Parque", categoria: "Cultura", endereco: "Rua das Palmeiras, 120 · Centro", recursos: ["Entrada sem degraus", "Banheiro acessível", "Piso tátil"] },
    { id: 2, nome: "Café Aurora", categoria: "Alimentação", endereco: "Avenida Central, 48 · Vila Nova", recursos: ["Entrada sem degraus", "Banheiro acessível"] },
    { id: 3, nome: "Museu da Cidade", categoria: "Cultura", endereco: "Praça da Estação, 8 · Centro", recursos: ["Entrada sem degraus", "Piso tátil", "Libras", "Audiodescrição"] },
    { id: 4, nome: "Parque das Águas", categoria: "Lazer", endereco: "Avenida das Flores, 600 · Jardim Sul", recursos: ["Entrada sem degraus", "Banheiro acessível", "Piso tátil"] },
    { id: 5, nome: "Centro de Atendimento Cidadão", categoria: "Serviços", endereco: "Rua do Mercado, 31 · Centro", recursos: ["Entrada sem degraus", "Banheiro acessível", "Libras"] },
    { id: 6, nome: "Cine Horizonte", categoria: "Lazer", endereco: "Rua Aurora, 210 · Vila Nova", recursos: ["Entrada sem degraus", "Audiodescrição", "Libras"] },
];

const SEM_FILTROS = { categoria: "", recursos: [], somenteFavoritos: false };
const ids = (lista) => lista.map((local) => local.id);
const filtrar = (termo = "", filtros = {}, favoritos = []) =>
    filtrarLocais(locais, termo, { ...SEM_FILTROS, ...filtros }, favoritos);


test("sem busca e sem filtros devolve todos os locais", () => {
    assert.deepEqual(ids(filtrar()), [1, 2, 3, 4, 5, 6]);
});

test("busca sem acento encontra nome acentuado", () => {
    assert.deepEqual(ids(filtrar("cafe")), [2]);
});

test("busca com acento encontra o mesmo resultado que sem acento", () => {
    assert.deepEqual(ids(filtrar("café")), ids(filtrar("cafe")));
    assert.deepEqual(ids(filtrar("águas")), ids(filtrar("aguas")));
});

test("busca ignora maiusculas e minusculas", () => {
    assert.deepEqual(ids(filtrar("MUSEU")), [3]);
    assert.deepEqual(ids(filtrar("mUsEu")), [3]);
});

test("busca ignora espacos nas pontas", () => {
    assert.deepEqual(ids(filtrar("  museu  ")), [3]);
});

test("busca so com espacos equivale a busca vazia", () => {
    assert.deepEqual(ids(filtrar("   ")), [1, 2, 3, 4, 5, 6]);
});

test("busca tambem considera o endereco, com ou sem acento", () => {
    assert.deepEqual(ids(filtrar("estacao")), [3]);
    assert.deepEqual(ids(filtrar("praça")), [3]);
    assert.deepEqual(ids(filtrar("centro")), [1, 3, 5]);
});

test("busca encontra nome e endereco e preserva a ordem original", () => {
    assert.deepEqual(ids(filtrar("aurora")), [2, 6]);
});

test("busca sem resultado devolve lista vazia", () => {
    assert.deepEqual(filtrar("zzzz"), []);
});


test("filtra cada categoria", () => {
    assert.deepEqual(ids(filtrar("", { categoria: "Cultura" })), [1, 3]);
    assert.deepEqual(ids(filtrar("", { categoria: "Alimentação" })), [2]);
    assert.deepEqual(ids(filtrar("", { categoria: "Lazer" })), [4, 6]);
    assert.deepEqual(ids(filtrar("", { categoria: "Serviços" })), [5]);
});

test("categoria vazia nao filtra", () => {
    assert.equal(filtrar("", { categoria: "" }).length, locais.length);
});


test("um recurso devolve todos os locais que o possuem", () => {
    assert.deepEqual(ids(filtrar("", { recursos: ["Libras"] })), [3, 5, 6]);
});

test("varios recursos exigem todos ao mesmo tempo", () => {
    assert.deepEqual(
        ids(filtrar("", { recursos: ["Libras", "Audiodescrição"] })),
        [3, 6],
    );
    assert.deepEqual(ids(filtrar("", { recursos: ["Piso tátil", "Libras"] })), [3]);
});

test("combinacao de recursos que nenhum local tem devolve lista vazia", () => {
    assert.deepEqual(
        filtrar("", { recursos: ["Piso tátil", "Audiodescrição", "Banheiro acessível"] }),
        [],
    );
});

test("busca combinada com categoria", () => {
    assert.deepEqual(ids(filtrar("centro", { categoria: "Cultura" })), [1, 3]);
    assert.deepEqual(ids(filtrar("centro", { categoria: "Serviços" })), [5]);
});

test("busca combinada com categoria sem intersecao devolve lista vazia", () => {
    assert.deepEqual(filtrar("centro", { categoria: "Lazer" }), []);
});

test("busca, categoria e recursos juntos", () => {
    assert.deepEqual(
        ids(filtrar("aurora", { categoria: "Lazer", recursos: ["Libras"] })),
        [6],
    );
    assert.deepEqual(
        filtrar("aurora", { categoria: "Alimentação", recursos: ["Libras"] }),
        [],
    );
});

// --- Integridade ---

test("somente favoritos devolve os ids favoritados na ordem dos locais", () => {
    assert.deepEqual(ids(filtrar("", { somenteFavoritos: true }, [6, 1, 3])), [1, 3, 6]);
});

test("favoritos nao restringem os resultados quando o filtro esta desativado", () => {
    assert.deepEqual(ids(filtrar("", {}, [3])), [1, 2, 3, 4, 5, 6]);
});

test("somente favoritos sem ids favoritos devolve lista vazia", () => {
    assert.deepEqual(filtrar("", { somenteFavoritos: true }), []);
});

test("ids favoritos inexistentes nao acrescentam locais aos resultados", () => {
    assert.deepEqual(ids(filtrar("", { somenteFavoritos: true }, [999, 3])), [3]);
});

test("somente favoritos combina com busca, categoria e recursos", () => {
    const filtros = { somenteFavoritos: true, categoria: "Cultura", recursos: ["Libras"] };
    assert.deepEqual(ids(filtrar("centro", filtros, [1, 3, 6])), [3]);
    assert.deepEqual(filtrar("centro", filtros, [1, 6]), []);
    assert.deepEqual(filtrar("aurora", filtros, [3, 6]), []);
    assert.deepEqual(filtrar("centro", { ...filtros, categoria: "Lazer" }, [3]), []);
    assert.deepEqual(filtrar("centro", { ...filtros, recursos: ["Banheiro acessível"] }, [3]), []);
});

test("filtrar favoritos nao altera locais, filtros ou ids favoritos", () => {
    const filtros = { ...SEM_FILTROS, somenteFavoritos: true, recursos: ["Libras"] };
    const favoritos = [6, 3, 999];
    const copia = structuredClone({ locais, filtros, favoritos });
    const resultado = filtrarLocais(locais, "", filtros, favoritos);

    assert.notEqual(resultado, locais);
    assert.deepEqual({ locais, filtros, favoritos }, copia);
});

test("nao altera a lista original e devolve um novo arranjo", () => {
    const copia = locais.map((local) => ({ ...local }));
    const resultado = filtrar("cafe");

    assert.notEqual(resultado, locais);
    assert.deepEqual(locais, copia);
});
