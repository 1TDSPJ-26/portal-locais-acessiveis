import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const detalhe = readFileSync(
  new URL("../src/pages/DetalheLocal/index.tsx", import.meta.url),
  "utf8",
);
const dialogo = detalhe.match(/<dialog\b[\s\S]*?<\/dialog>/)?.[0];

test("diálogo de exclusão tem nome e descrição acessíveis associados", () => {
  assert.ok(dialogo, "diálogo de exclusão não encontrado");

  const rotulo = dialogo.match(/aria-labelledby="([^"]+)"/)?.[1];
  const descricao = dialogo.match(/aria-describedby="([^"]+)"/)?.[1];

  assert.ok(rotulo, "o diálogo deve referenciar seu título");
  assert.ok(descricao, "o diálogo deve referenciar sua descrição");
  assert.ok(dialogo.includes(`id="${rotulo}"`), "o título referenciado deve existir no diálogo");
  assert.ok(dialogo.includes(`id="${descricao}"`), "a descrição referenciada deve existir no diálogo");
});
