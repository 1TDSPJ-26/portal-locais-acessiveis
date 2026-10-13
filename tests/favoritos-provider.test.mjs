import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { transpileModule, JsxEmit, ModuleKind } from "typescript";
import { LocaisContext } from "../src/LocaisContext.ts";
import { CHAVE_FAVORITOS } from "../src/favoritos.ts";

// Mesmo padrão de mensagem.test.mjs: compila os módulos reais em memória.
function compilar(caminho, importacoes = {}) {
  const arquivo = new URL(caminho, import.meta.url);
  const { outputText } = transpileModule(readFileSync(arquivo, "utf8"), {
    compilerOptions: { jsx: JsxEmit.ReactJSX, module: ModuleKind.ESNext },
  });
  const codigo = outputText.replace(/from "([^"]+)"/g, (_, modulo) => {
    const destino = importacoes[modulo] ?? (modulo.startsWith(".")
      ? new URL(`${modulo}.ts`, arquivo).href
      : import.meta.resolve(modulo));
    return `from ${JSON.stringify(destino)}`;
  });
  return `data:text/javascript;base64,${Buffer.from(codigo).toString("base64")}`;
}

const { FavoritosProvider } = await import(compilar("../src/FavoritosProvider.tsx", {
  "./useLocais": compilar("../src/useLocais.ts"),
}));
const { useFavoritos } = await import(compilar("../src/useFavoritos.ts"));

const armazenamentoOriginal = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
let salvo;

beforeEach(() => {
  salvo = "[42,1]";
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    writable: true,
    value: {
      getItem: (chave) => chave === CHAVE_FAVORITOS ? salvo : null,
      setItem: (_, valor) => { salvo = valor; },
    },
  });
});

afterEach(() => {
  if (armazenamentoOriginal) {
    Object.defineProperty(globalThis, "localStorage", armazenamentoOriginal);
  } else {
    delete globalThis.localStorage;
  }
});

function renderizar({ ids = [1, 42], estado = "pronto", usandoReserva = false } = {}) {
  function Consumidor() {
    const contexto = useFavoritos();
    return createElement("output", null, JSON.stringify({
      favoritos: contexto.favoritos,
      totalFavoritos: contexto.totalFavoritos,
      favorito42: contexto.ehFavorito(42),
      favorito999: contexto.ehFavorito(999),
      tipoAlternar: typeof contexto.alternarFavorito,
    }));
  }
  const contextoLocais = {
    locais: ids.map((id) => ({ id })),
    estado,
    usandoReserva,
  };
  const html = renderToStaticMarkup(createElement(LocaisContext.Provider, { value: contextoLocais },
    createElement(FavoritosProvider, null, createElement(Consumidor)),
  ));
  return JSON.parse(html.replace(/^<output>|<\/output>$/g, "").replaceAll("&quot;", '"'));
}

test("o consumidor recebe lista, consulta, alternância e total na mesma interface", () => {
  const contexto = renderizar();
  assert.deepEqual(contexto.favoritos, [42, 1]);
  assert.equal(contexto.totalFavoritos, 2);
  assert.equal(contexto.favorito42, true);
  assert.equal(contexto.favorito999, false);
  assert.equal(contexto.tipoAlternar, "function");
});

test("retira IDs ausentes quando a lista confiável está pronta", () => {
  const contexto = renderizar({ ids: [1] });
  assert.deepEqual(contexto.favoritos, [1]);
  assert.equal(contexto.totalFavoritos, 1);
  assert.equal(contexto.favorito42, false);
});

test("uma lista vazia carregada com sucesso remove todos os favoritos", () => {
  const contexto = renderizar({ ids: [] });
  assert.deepEqual(contexto.favoritos, []);
  assert.equal(contexto.totalFavoritos, 0);
});

test("não retira favoritos enquanto os locais estão carregando", () => {
  assert.deepEqual(renderizar({ ids: [], estado: "carregando" }).favoritos, [42, 1]);
});

test("não retira favoritos quando o carregamento está em erro", () => {
  assert.deepEqual(renderizar({ ids: [], estado: "erro" }).favoritos, [42, 1]);
});

test("a reserva não apaga o favorito de um local que ela não contém", () => {
  assert.deepEqual(renderizar({ ids: [1], usandoReserva: true }).favoritos, [42, 1]);
});

test("conteúdo corrompido começa vazio sem impedir a renderização", () => {
  for (const bruto of ["{inválido", "[1,1]", "[1,\"2\"]"]) {
    salvo = bruto;
    assert.deepEqual(renderizar().favoritos, []);
  }
});

test("armazenamento indisponível não impede a renderização do contexto", () => {
  globalThis.localStorage.getItem = () => { throw new Error("Bloqueado"); };
  assert.equal(renderizar().totalFavoritos, 0);
});

test("useFavoritos orienta o consumidor quando falta FavoritosProvider", () => {
  function SemProvider() {
    useFavoritos();
    return null;
  }
  assert.throws(() => renderToStaticMarkup(createElement(SemProvider)),
    /useFavoritos deve ser usado dentro de FavoritosProvider/);
});

test("FavoritosProvider exige LocaisProvider acima dele", () => {
  assert.throws(() => renderToStaticMarkup(createElement(FavoritosProvider)),
    /useLocais deve ser usado dentro de LocaisProvider/);
});
