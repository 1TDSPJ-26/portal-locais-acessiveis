import {
  categoriasLocais,
  recursosAcessibilidade,
  type CategoriaLocal,
  type Local,
  type RecursoAcessibilidade,
} from "../types/local.ts";

export type DadosLocalEntrada = Omit<
  Local,
  "id" | "categoria" | "recursos"
> & {
  categoria: string;
  recursos: readonly string[];
};

export type DadosLocalValidado = Omit<Local, "id">;

export class LocalInvalidoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LocalInvalidoError";
  }
}

const sanitizarTexto = (valor: string): string =>
  valor
    .normalize("NFC")
    .replace(/[\p{Cc}\p{Cf}]/gu, "")
    .replace(/\s+/gu, " ")
    .trim();

const sanitizarOpcional = (valor?: string): string | undefined => {
  if (valor === undefined) {
    return undefined;
  }

  const sanitizado = sanitizarTexto(valor);

  return sanitizado.length > 0 ? sanitizado : undefined;
};

const sanitizarSite = (valor?: string): string | undefined => {
  const site = sanitizarOpcional(valor);

  if (!site) {
    return undefined;
  }

  if (/^https?:\/\//i.test(site)) {
    return site;
  }

  if (/^[a-z][a-z\d+.-]*:/i.test(site)) {
    throw new LocalInvalidoError(
      "O site deve utilizar o protocolo http ou https.",
    );
  }

  return `https://${site}`;
};

const recursoValido = (recurso: string): recurso is RecursoAcessibilidade =>
  recursosAcessibilidade.includes(recurso as RecursoAcessibilidade);

const sanitizarRecursos = (
  recursos: readonly string[],
): RecursoAcessibilidade[] => {
  const sanitizados = recursos.map(sanitizarTexto).filter(recursoValido);

  return [...new Set(sanitizados)];
};

export function sanitizarLocal(dados: DadosLocalEntrada): DadosLocalEntrada {
  const descricao = sanitizarOpcional(dados.descricao);
  const email = sanitizarOpcional(dados.email)?.toLocaleLowerCase("pt-BR");
  const telefone = sanitizarOpcional(dados.telefone);
  const site = sanitizarSite(dados.site);

  return {
    nome: sanitizarTexto(dados.nome),
    categoria: sanitizarTexto(dados.categoria),
    endereco: sanitizarTexto(dados.endereco),
    recursos: sanitizarRecursos(dados.recursos),
    ...(descricao !== undefined && { descricao }),
    ...(email !== undefined && { email }),
    ...(telefone !== undefined && { telefone }),
    ...(site !== undefined && { site }),
  };
}

const categoriaValida = (categoria: string): categoria is CategoriaLocal =>
  categoriasLocais.includes(categoria as CategoriaLocal);

export function validarLocal(
  dados: DadosLocalEntrada,
): asserts dados is DadosLocalValidado {
  if (!dados.nome) {
    throw new LocalInvalidoError("O local deve possuir um nome.");
  }

  if (!dados.endereco) {
    throw new LocalInvalidoError("O local deve possuir um endereço.");
  }

  if (!categoriaValida(dados.categoria)) {
    throw new LocalInvalidoError("A categoria do local é inválida.");
  }
}