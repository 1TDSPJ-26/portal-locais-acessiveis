import assert from "node:assert/strict";
import test from "node:test";

import {
  LocalInvalidoError,
  sanitizarLocal,
  validarLocal,
} from "../src/utils/sanitizar-local.ts";

test("remove espaços das pontas e reduz espaços repetidos", () => {
  const dados = {
    nome: "  Biblioteca   Central  ",
    categoria: "Cultura",
    endereco: "  Rua   das   Flores, 100  ",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.equal(resultado.nome, "Biblioteca Central");
  assert.equal(resultado.endereco, "Rua das Flores, 100");
});

test("remove caracteres de controle dos textos", () => {
  const dados = {
    nome: "Biblioteca\u0000 Central",
    categoria: "Cultura",
    endereco: "Rua das Flores\u0007, 100",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.equal(resultado.nome, "Biblioteca Central");
  assert.equal(resultado.endereco, "Rua das Flores, 100");
});

test("normaliza textos para NFC", () => {
  const dados = {
    nome: "Cafe\u0301 Central",
    categoria: "Cultura",
    endereco: "Rua Principal",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.equal(resultado.nome, "Café Central");
  assert.equal(resultado.nome, resultado.nome.normalize("NFC"));
});

test("converte email para letras minúsculas", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
    email: "  CONTATO@EXEMPLO.COM  ",
  };

  const resultado = sanitizarLocal(dados);

  assert.equal(resultado.email, "contato@exemplo.com");
});

test("adiciona https ao site sem protocolo", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
    site: "exemplo.com",
  };

  const resultado = sanitizarLocal(dados);

  assert.equal(resultado.site, "https://exemplo.com");
});

test("mantém sites com protocolo http ou https", () => {
  const dadosHttp = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
    site: "http://exemplo.com",
  };

  const dadosHttps = {
    ...dadosHttp,
    site: "https://exemplo.com",
  };

  assert.equal(sanitizarLocal(dadosHttp).site, "http://exemplo.com");
  assert.equal(sanitizarLocal(dadosHttps).site, "https://exemplo.com");
});

test("rejeita site com protocolo diferente de http ou https", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
    site: "ftp://exemplo.com",
  };

  assert.throws(() => sanitizarLocal(dados), LocalInvalidoError);
});

test("descarta campos opcionais que ficam vazios", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
    descricao: "   ",
    email: "   ",
    telefone: "   ",
    site: "   ",
  };

  const resultado = sanitizarLocal(dados);

  assert.equal("descricao" in resultado, false);
  assert.equal("email" in resultado, false);
  assert.equal("telefone" in resultado, false);
  assert.equal("site" in resultado, false);
});

test("remove recursos de acessibilidade desconhecidos", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: ["Entrada sem degraus", "Recurso inexistente"],
  };

  const resultado = sanitizarLocal(dados);

  assert.deepEqual(resultado.recursos, ["Entrada sem degraus"]);
});

test("remove recursos de acessibilidade duplicados", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [
      "Entrada sem degraus",
      "Banheiro acessível",
      "Entrada sem degraus",
    ],
  };

  const resultado = sanitizarLocal(dados);

  assert.deepEqual(resultado.recursos, [
    "Entrada sem degraus",
    "Banheiro acessível",
  ]);
});

test("rejeita local sem nome após sanitização", () => {
  const dados = {
    nome: "   ",
    categoria: "Cultura",
    endereco: "Rua das Flores, 100",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.throws(() => validarLocal(resultado), {
    name: "LocalInvalidoError",
    message: "O local deve possuir um nome.",
  });
});

test("rejeita local sem endereço após sanitização", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "   ",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.throws(() => validarLocal(resultado), {
    name: "LocalInvalidoError",
    message: "O local deve possuir um endereço.",
  });
});

test("rejeita categoria que não existe", () => {
  const dados = {
    nome: "Biblioteca Central",
    categoria: "Categoria inventada",
    endereco: "Rua das Flores, 100",
    recursos: [],
  };

  const resultado = sanitizarLocal(dados);

  assert.throws(() => validarLocal(resultado), {
    name: "LocalInvalidoError",
    message: "A categoria do local é inválida.",
  });
});

test("aceita local válido após sanitização", () => {
  const dados = {
    nome: "  Biblioteca Central  ",
    categoria: "Cultura",
    endereco: "  Rua das Flores, 100  ",
    recursos: ["Entrada sem degraus"],
  };

  const resultado = sanitizarLocal(dados);

  assert.doesNotThrow(() => validarLocal(resultado));
});