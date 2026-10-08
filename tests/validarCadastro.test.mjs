import assert from "node:assert/strict";
import { test } from "node:test";

import {
  validarNome,
  validarEmail,
  validarCep,
  validarTelefone,
  validarSite,
} from "../src/utils/ValidarCadastro.ts";

test("aceita um nome válido", () => {
  assert.equal(validarNome("Biblioteca da Cidade"), null);
});

test("recusa nome com menos de 3 caracteres", () => {
  assert.equal(
    validarNome("AB"),
    "Digite pelo menos 3 caracteres."
  );
});

test("aceita um e-mail válido", () => {
  assert.equal(validarEmail("teste@exemplo.com"), null);
});

test("recusa e-mail inválido", () => {
  assert.equal(
    validarEmail("teste@"),
    "Digite um e-mail válido, como nome@exemplo.com."
  );
});

test("aceita um CEP válido", () => {
  assert.equal(validarCep("01234-567"), null);
});

test("recusa CEP inválido", () => {
  assert.equal(
    validarCep("123"),
    "Digite um CEP válido, no formato 00000-000."
  );
});

test("aceita telefone vazio porque o campo é opcional", () => {
  assert.equal(validarTelefone(""), null);
});

test("recusa telefone inválido", () => {
  assert.equal(
    validarTelefone("123"),
    "Digite um telefone válido, como (11) 91234-5678."
  );
});

test("aceita site válido", () => {
  assert.equal(validarSite("https://exemplo.com"), null);
});

test("recusa site inválido", () => {
  assert.equal(
    validarSite("site-invalido"),
    "Digite um endereço de site válido, como https://exemplo.com."
  );
});