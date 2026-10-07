import { categoriasLocais, recursosAcessibilidade } from "./types/local.ts";
import type { CategoriaLocal, Local, RecursoAcessibilidade } from "./types/local";

export const CHAVE_LOCAIS = "locais-cadastrados";


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
    Array.isArray(candidato.recursos) && candidato.recursos.every(ehRecurso);

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
  const bruto = localStorage.getItem(CHAVE_LOCAIS);
  if (bruto === null) return null;
  const locais = validarLocais(JSON.parse(bruto));
  if (locais === null) throw new Error("A lista salva de locais é inválida.");
  return locais;
}

export function salvarLocais(locais: Local[]): void {
  try {
    localStorage.setItem(CHAVE_LOCAIS, JSON.stringify(locais));
  } catch {
  }
}
