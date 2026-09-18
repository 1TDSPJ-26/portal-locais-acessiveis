import type { Local } from "../types/local";

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
  dados: DadosCadastroLocal,
): Local {
  const nome = dados.nome.trim();
  const endereco = dados.endereco.trim();
  const duplicado = locais.some(
    (local) =>
      normalizar(local.nome) === normalizar(nome) &&
      normalizar(local.endereco) === normalizar(endereco),
  );

  if (duplicado) {
    throw new LocalDuplicadoError();
  }

  const id = locais.reduce((maior, local) => Math.max(maior, local.id), 0) + 1;
  return { ...dados, id, nome, endereco, recursos: [...dados.recursos] };
}
