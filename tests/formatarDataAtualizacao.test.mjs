import assert from "node:assert/strict";
import test from "node:test";

import { formatarDataAtualizacao } from "../src/utils/formatar-data-atualizacao.ts";

test("formata data e hora em pt-BR no formato 13/10/2026 às 14:32", () => {
  const data = new Date("2026-10-13T17:32:00Z");
  assert.equal(formatarDataAtualizacao(data), "13/10/2026 às 14:32");
});

test("converte de UTC para o horário de Brasília e muda o dia quando necessário", () => {
  assert.equal(
    formatarDataAtualizacao(new Date("2026-10-14T02:59:00Z")),
    "13/10/2026 às 23:59",
  );
  assert.equal(
    formatarDataAtualizacao(new Date("2026-10-14T03:00:00Z")),
    "14/10/2026 às 00:00",
  );
});

test("completa dia, mês e minuto com zero à esquerda", () => {
  assert.equal(
    formatarDataAtualizacao(new Date("2026-01-05T12:05:00Z")),
    "05/01/2026 às 09:05",
  );
});

test("retorna texto vazio para data inválida", () => {
  assert.equal(formatarDataAtualizacao(new Date("invalida")), "");
});