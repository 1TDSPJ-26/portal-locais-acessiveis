import assert from "node:assert/strict";
import test from "node:test";

import {
  criarLocal,
  LocalDuplicadoError,
} from "../src/services/cadastroLocal.ts";
import { filtrarLocais } from "../src/utils/filtrar-locais.ts";
import {
  dadosFormularioParaCadastro,
} from "../src/utils/converter-formulario.ts";
import {
  formularioValido as formularioSemErros,
  validarFormulario,
} from "../src/utils/ValidarCadastro.ts";
import { sanitizarLocal } from "../src/utils/sanitizar-local.ts";
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

test("cria com dados válidos e encontra o local por nome, categoria e cada recurso", () => {
  const erros = validarFormulario(formularioCompleto);
  assert.equal(formularioSemErros(erros), true);

  const dadosCadastro = dadosFormularioParaCadastro(formularioCompleto);
  const novoLocal = criarLocal([], dadosCadastro);
  const locais = [novoLocal];

  assert.deepEqual(
    filtrarLocais(locais, "biblioteca parque", {
      categoria: "",
      recursos: [],
    }),
    [novoLocal],
  );
  assert.deepEqual(
    filtrarLocais(locais, "", {
      categoria: "Cultura",
      recursos: [],
    }),
    [novoLocal],
  );

  for (const recurso of formularioCompleto.recursos) {
    assert.deepEqual(
      filtrarLocais(locais, "", {
        categoria: "",
        recursos: [recurso],
      }),
      [novoLocal],
      `O local deve ser encontrado pelo recurso "${recurso}"`,
    );
  }
});

test("o local recém-criado não aparece se não corresponder aos filtros", () => {
  const novoLocal = criarLocal([], {
    nome: "Centro Cultural",
    categoria: "Cultura",
    endereco: "Rua das Flores, 10",
    recursos: ["Libras"],
  });

  assert.deepEqual(
    filtrarLocais([novoLocal], "Centro", {
      categoria: "Lazer",
      recursos: [],
    }),
    [],
  );
  assert.deepEqual(
    filtrarLocais([novoLocal], "Centro", {
      categoria: "Cultura",
      recursos: ["Audiodescrição"],
    }),
    [],
  );
});

test("recusa criar um local duplicado", () => {
  const dadosCadastro = dadosFormularioParaCadastro(formularioCompleto);
  const localExistente = criarLocal([], dadosCadastro);

  assert.throws(
    () => criarLocal([localExistente], dadosCadastro),
    LocalDuplicadoError,
  );
});

test("mantém IDs únicos após cadastros sucessivos", () => {
  const primeiroLocal = criarLocal([], {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua Principal, 100",
    recursos: [],
  });
  const segundoLocal = criarLocal([primeiroLocal], {
    nome: "Museu Municipal",
    categoria: "Cultura",
    endereco: "Rua Secundária, 200",
    recursos: [],
  });

  assert.equal(primeiroLocal.id, 1);
  assert.equal(segundoLocal.id, 2);
  assert.notEqual(primeiroLocal.id, segundoLocal.id);
});

test("sanitiza os dados antes de criar e localizar o local", () => {
  const dadosSanitizados = sanitizarLocal({
    nome: "  Cafe\u0301\u0000   Central  ",
    categoria: "Cultura",
    endereco: "  Rua   das Flores, 100  ",
    recursos: ["Libras", "Libras", "Recurso inexistente"],
    email: "  CONTATO@EXEMPLO.COM  ",
    site: "exemplo.com",
  });
  const local = criarLocal([], dadosSanitizados);

  assert.equal(local.nome, "Café Central");
  assert.equal(local.endereco, "Rua das Flores, 100");
  assert.deepEqual(local.recursos, ["Libras"]);
  assert.equal(local.email, "contato@exemplo.com");
  assert.equal(local.site, "https://exemplo.com");
  assert.deepEqual(
    filtrarLocais([local], "cafe central", {
      categoria: "Cultura",
      recursos: ["Libras"],
    }),
    [local],
  );
});