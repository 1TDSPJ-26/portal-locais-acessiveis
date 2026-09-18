import assert from "node:assert/strict";
import { test } from "node:test";
import {
  dadosFormularioParaCadastro,
  montarEndereco,
} from "../src/utils/converter-formulario.ts";
import { DADOS_INICIAIS } from "../src/types/local.ts";

const preenchido = {
  ...DADOS_INICIAIS,
  nome: "  Biblioteca Parque  ",
  categoria: "Cultura",
  descricao: "Biblioteca com acervo acessível.",
  logradouro: "Rua das Flores",
  numero: "10",
  complemento: "Sala 2",
  bairro: "Centro",
  cidade: "São Paulo",
  estado: "SP",
  cep: "01234-567",
  recursos: ["Piso tátil", "Libras"],
  email: "contato@exemplo.com",
  telefone: "(11) 91234-5678",
  site: "https://exemplo.com",
};

test("reune os campos de endereço numa linha unica", () => {
  assert.equal(
    montarEndereco(preenchido),
    "Rua das Flores, 10, Sala 2 · Centro · São Paulo - SP · CEP 01234-567",
  );
});

test("nao deixa separador solto quando o complemento esta vazio", () => {
  const endereco = montarEndereco({ ...preenchido, complemento: "" });

  assert.equal(
    endereco,
    "Rua das Flores, 10 · Centro · São Paulo - SP · CEP 01234-567",
  );
  assert.ok(!endereco.includes("··"));
  assert.ok(!endereco.includes(", ,"));
});

test("preserva os recursos marcados no formulario", () => {
  const dados = dadosFormularioParaCadastro(preenchido);

  assert.deepEqual(dados.recursos, ["Piso tátil", "Libras"]);
});

test("nao compartilha o arranjo de recursos com o formulario", () => {
  const dados = dadosFormularioParaCadastro(preenchido);

  assert.notEqual(dados.recursos, preenchido.recursos);
});

test("recorta os espacos em volta do nome", () => {
  assert.equal(dadosFormularioParaCadastro(preenchido).nome, "Biblioteca Parque");
});

test("preserva descricao e contato", () => {
  const dados = dadosFormularioParaCadastro(preenchido);

  assert.equal(dados.descricao, "Biblioteca com acervo acessível.");
  assert.equal(dados.email, "contato@exemplo.com");
  assert.equal(dados.telefone, "(11) 91234-5678");
  assert.equal(dados.site, "https://exemplo.com");
});

test("campo opcional em branco fica ausente, e nao texto vazio", () => {
  const dados = dadosFormularioParaCadastro({
    ...preenchido,
    telefone: "   ",
    site: "",
  });

  assert.equal(dados.telefone, undefined);
  assert.equal(dados.site, undefined);
});

test("recusa converter enquanto a categoria nao for escolhida", () => {
  assert.throws(
    () => dadosFormularioParaCadastro({ ...preenchido, categoria: "" }),
    /categoria/i,
  );
});
