import assert from "node:assert/strict";
import test from "node:test";

import {
  dadosFormularioParaCadastro,
} from "../src/utils/converter-formulario.ts";
import {
  formularioValido as formularioSemErros,
  validarFormulario,
} from "../src/utils/ValidarCadastro.ts";
import { DADOS_INICIAIS } from "../src/types/local.ts";

const formularioCompleto = {
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

test("valida o formulário antes de convertê-lo para cadastro", () => {
  const erros = validarFormulario(formularioCompleto);

  assert.deepEqual(erros, {});
  assert.equal(formularioSemErros(erros), true);

  const dadosCadastro = dadosFormularioParaCadastro(formularioCompleto);

  assert.deepEqual(dadosCadastro, {
    nome: "Biblioteca Parque",
    categoria: "Cultura",
    endereco:
      "Rua das Flores, 10, Sala 2 · Centro · São Paulo - SP · CEP 01234-567",
    recursos: ["Piso tátil", "Libras"],
    descricao: "Biblioteca com acervo acessível.",
    email: "contato@exemplo.com",
    telefone: "(11) 91234-5678",
    site: "https://exemplo.com",
  });
});

test("não converte o formulário para cadastro quando a validação falha", () => {
  const formularioInvalido = {
    ...formularioCompleto,
    email: "email-invalido",
    estado: "",
  };
  const erros = validarFormulario(formularioInvalido);
  let dadosCadastro;
  let conversaoExecutada = false;

  if (formularioSemErros(erros)) {
    conversaoExecutada = true;
    dadosCadastro = dadosFormularioParaCadastro(formularioInvalido);
  }

  assert.deepEqual(Object.keys(erros).sort(), ["email", "estado"]);
  assert.equal(formularioSemErros(erros), false);
  assert.equal(conversaoExecutada, false);
  assert.equal(dadosCadastro, undefined);
});