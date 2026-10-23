import { categoriasLocais, recursosAcessibilidade } from "./types/local.ts";
import type { CategoriaLocal, Local, RecursoAcessibilidade } from "./types/local";
import { ErroCarregamentoLocais } from "./services/erros.ts";

export const CHAVE_LOCAIS = "locais-cadastrados";
export const CHAVE_ATUALIZADO_EM = "locais-atualizados-em";

function ehCategoria(valor: unknown): valor is CategoriaLocal {
  return typeof valor === "string" && categoriasLocais.includes(valor as CategoriaLocal);
}

function ehRecurso(valor: unknown): valor is RecursoAcessibilidade {
  return typeof valor === "string" && recursosAcessibilidade.includes(valor as RecursoAcessibilidade);
}

function ehLocal(valor: unknown): valor is Local {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }
  const candidato = valor as Record<string, unknown>;

  const camposObrigatoriosValidos =
    typeof candidato.id === "number" && Number.isFinite(candidato.id) &&
    typeof candidato.nome === "string" && candidato.nome.length > 0 &&
    ehCategoria(candidato.categoria) &&
    typeof candidato.endereco === "string" && candidato.endereco.length > 0 &&
    Array.isArray(candidato.recursos) && candidato.recursos.every(ehRecurso) &&

    (candidato.latitude === undefined || (typeof candidato.latitude === "number" &&
        Number.isFinite(candidato.latitude) && 
        candidato.latitude >= -90 &&
        candidato.latitude <= 90)) &&
    (candidato.longitude === undefined || (typeof candidato.longitude === "number" &&
        Number.isFinite(candidato.longitude) &&
        candidato.longitude >= -180 &&
        candidato.longitude <= 180));

  if (!camposObrigatoriosValidos) {
    return false;
  }

  const opcionaisTexto = ["descricao", "email", "telefone", "site"] as const;
  return opcionaisTexto.every((campo) => {
    const valorCampo = candidato[campo];
    return valorCampo === undefined || typeof valorCampo === "string";
  });
}

export function validarLocais(valor: unknown): Local[] | null {
  if (!Array.isArray(valor)) {
    return null;
  }
  if (!valor.every(ehLocal)) {
    return null;
  }
  return valor;
}

export function carregarLocaisSalvos(): Local[] | null {
  let bruto: string | null;
  try {
    bruto = localStorage.getItem(CHAVE_LOCAIS);
  } catch {
    throw new ErroCarregamentoLocais(
      "armazenamento-indisponivel",
      "O armazenamento do navegador não está disponível.",
    );
  }

  if (bruto === null) return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(bruto);
  } catch {
    throw new ErroCarregamentoLocais(
      "desconhecido",
      "Os dados salvos estão corrompidos e não puderam ser lidos.",
    );
  }

  const locais = validarLocais(parsed);
  if (locais === null) {
    throw new ErroCarregamentoLocais(
      "dados-invalidos",
      "A lista salva de locais é inválida.",
    );
  }

  return locais;
}

export function salvarLocais(locais: Local[]): void {
  try {
    localStorage.setItem(CHAVE_LOCAIS, JSON.stringify(locais));
  } catch {
  }
}

// Lê a data da última alteração feita pelo usuário. Valor ausente, inválido ou
// armazenamento indisponível resultam em null, sem erro na tela.
export function carregarAtualizadoEm(): Date | null {
  try {
    const bruto = localStorage.getItem(CHAVE_ATUALIZADO_EM);

    if (bruto === null || !/^\d{4}-\d{2}-\d{2}T/.test(bruto)) {
      return null;
    }

    const data = new Date(bruto);
    return Number.isNaN(data.getTime()) ? null : data;
  } catch {
    return null;
  }
}

// Deve ser chamada somente quando o usuário cadastra, edita ou remove um local.
// Nunca a partir de salvarLocais, que roda a cada carregamento da lista.
export function registrarAtualizacao(data: Date = new Date()): void {
  try {
    localStorage.setItem(CHAVE_ATUALIZADO_EM, data.toISOString());
  } catch {
    // ignora falha de armazenamento
  }
}