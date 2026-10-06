import type { Local } from "../types/local.ts";

import {
  sanitizarLocal,
  validarLocal,
  type DadosLocalEntrada,
} from "../utils/sanitizar-local.ts";

export type DadosCadastroLocal = Omit<Local, "id">;

export class LocalDuplicadoError extends Error {
  constructor() {
    super("Já existe um local cadastrado com este nome e endereço.");
    this.name = "LocalDuplicadoError";
  }
}

const normalizar = (valor: string) =>
  valor
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/\s+/g, " ")
    .trim();

export function criarLocal(
  locais: readonly Local[],
  dados: DadosLocalEntrada,
): Local {
  const dadosSanitizados = sanitizarLocal(dados);

  validarLocal(dadosSanitizados);

  const duplicado = locais.some(
    (local) =>
      normalizar(local.nome) === normalizar(dadosSanitizados.nome) &&
      normalizar(local.endereco) === normalizar(dadosSanitizados.endereco),
  );

  if (duplicado) {
    throw new LocalDuplicadoError();
  }

  const id = locais.reduce((maior, local) => Math.max(maior, local.id), 0) + 1;

  return {
    ...dadosSanitizados,
    id,
    recursos: [...dadosSanitizados.recursos],
  };
}