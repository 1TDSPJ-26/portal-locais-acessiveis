import assert from "node:assert/strict";
import test from "node:test";

import {
  criarLocal,
  editarLocal,
  LocalDuplicadoError,
} from "../src/services/cadastroLocal.ts";

const base = {
  nome: "Biblioteca Central",
  categoria: "Cultura",
  endereco: "Rua Principal, 100",
  recursos: ["Entrada sem degraus"],
};

test("gera o ID a partir do maior ID, mesmo com lacunas", () => {
  const locais = [
    { id: 2, ...base },
    {
      id: 8,
      ...base,
      nome: "Museu Municipal",
      endereco: "Rua Secundária, 200",
    },
  ];

  const novoLocal = criarLocal(locais, {
    ...base,
    nome: "Centro Cultural",
    endereco: "Avenida Central, 300",
  });

  assert.equal(novoLocal.id, 9);
});

test("recusa nome e endereço iguais sem distinguir caixa ou acentos", () => {
  const locais = [
    {
      id: 1,
      ...base,
      nome: "Café Central",
      endereco: "Rua São João, 100",
    },
  ];

  assert.throws(
    () =>
      criarLocal(locais, {
        ...base,
        nome: "cafe central",
        endereco: "rua sao joao, 100",
      }),
    LocalDuplicadoError,
  );
});

test("permite mesmo nome em outro endereço", () => {
  const locais = [{ id: 1, ...base }];

  const novoLocal = criarLocal(locais, {
    ...base,
    endereco: "Rua Secundária, 200",
  });

  assert.equal(novoLocal.id, 2);
  assert.equal(novoLocal.nome, base.nome);
  assert.equal(novoLocal.endereco, "Rua Secundária, 200");
});

test("não repete IDs em cadastros sucessivos", () => {
  const locais = [{ id: 1, ...base }];

  const primeiro = criarLocal(locais, {
    ...base,
    nome: "Museu Municipal",
    endereco: "Rua A, 10",
  });

  const segundo = criarLocal([...locais, primeiro], {
    ...base,
    nome: "Centro Cultural",
    endereco: "Rua B, 20",
  });

  assert.equal(primeiro.id, 2);
  assert.equal(segundo.id, 3);
});

test("copia os recursos para não compartilhar o arranjo do formulário", () => {
  const recursos = ["Entrada sem degraus"];

  const novoLocal = criarLocal([], {
    ...base,
    recursos,
  });

  assert.deepEqual(novoLocal.recursos, recursos);
  assert.notEqual(novoLocal.recursos, recursos);
});

test("sanitiza os dados antes de criar o local", () => {
  const local = criarLocal([], {
    nome: "  Biblioteca   Central  ",
    categoria: "Cultura",
    endereco: "  Rua   das   Flores, 100  ",
    recursos: ["Entrada sem degraus", "Entrada sem degraus"],
    email: "  CONTATO@EXEMPLO.COM  ",
    site: "biblioteca.com.br",
  });

  assert.equal(local.nome, "Biblioteca Central");
  assert.equal(local.endereco, "Rua das Flores, 100");
  assert.equal(local.email, "contato@exemplo.com");
  assert.equal(local.site, "https://biblioteca.com.br");
  assert.deepEqual(local.recursos, ["Entrada sem degraus"]);
});

test("detecta duplicidade mesmo com espaços diferentes", () => {
  const locais = [
    {
      id: 1,
      nome: "Biblioteca Central",
      categoria: "Cultura",
      endereco: "Rua das Flores, 100",
      recursos: [],
    },
  ];

  assert.throws(() =>
    criarLocal(locais, {
      nome: "  Biblioteca   Central  ",
      categoria: "Cultura",
      endereco: "Rua   das   Flores, 100",
      recursos: [],
    }),
  );
});

test("detecta duplicidade com representações Unicode diferentes", () => {
  const locais = [
    {
      id: 1,
      nome: "Café Central",
      categoria: "Alimentação",
      endereco: "Rua Principal, 10",
      recursos: [],
    },
  ];

  assert.throws(() =>
    criarLocal(locais, {
      nome: "Cafe\u0301 Central",
      categoria: "Alimentação",
      endereco: "Rua Principal, 10",
      recursos: [],
    }),
  );
});

test("não cria local inválido após sanitização", () => {
  assert.throws(() =>
    criarLocal([], {
      nome: "   ",
      categoria: "Cultura",
      endereco: "Rua das Flores, 100",
      recursos: [],
    }),
  );
});

test("edita local sem mudar o ID e recusa duplicidade com outro local", () => {
  const locais = [
    {
      id: 1,
      nome: "Biblioteca Central",
      categoria: "Cultura",
      endereco: "Rua A, 10",
      recursos: ["Entrada sem degraus"],
    },
    {
      id: 2,
      nome: "Museu Municipal",
      categoria: "Cultura",
      endereco: "Rua B, 20",
      recursos: [],
    },
  ];

  const atualizados = editarLocal(locais, 1, {
    nome: "Biblioteca Central",
    categoria: "Cultura",
    endereco: "Rua A, 15",
    recursos: ["Entrada sem degraus", "Banheiro acessível"],
  });

  assert.equal(atualizados[0].id, 1);
  assert.equal(atualizados[0].endereco, "Rua A, 15");
  assert.deepEqual(atualizados[0].recursos, [
    "Entrada sem degraus",
    "Banheiro acessível",
  ]);

  assert.doesNotThrow(() =>
    editarLocal(locais, 1, {
      nome: "Biblioteca Central",
      categoria: "Cultura",
      endereco: "Rua A, 10",
      recursos: ["Entrada sem degraus"],
    }),
  );

  assert.throws(
    () =>
      editarLocal(locais, 2, {
        nome: "Biblioteca Central",
        categoria: "Cultura",
        endereco: "Rua A, 10",
        recursos: [],
      }),
    LocalDuplicadoError,
  );
});