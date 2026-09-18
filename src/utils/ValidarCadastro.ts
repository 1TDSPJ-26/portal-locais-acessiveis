import type { DadosFormularioLocal } from "../types/local";


export type CampoCadastro =
  | "nome"
  | "categoria"
  | "descricao"
  | "logradouro"
  | "numero"
  | "bairro"
  | "cidade"
  | "estado"
  | "cep"
  | "email"
  | "telefone"
  | "site";


export type ErrosCadastro = Partial<Record<CampoCadastro, string>>;


export const ROTULOS_CAMPOS: Record<CampoCadastro, string> = {
  nome: "Nome do local",
  categoria: "Categoria",
  descricao: "Descrição",
  logradouro: "Logradouro",
  numero: "Número",
  bairro: "Bairro",
  cidade: "Cidade",
  estado: "Estado (UF)",
  cep: "CEP",
  email: "E-mail",
  telefone: "Telefone",
  site: "Site",
};

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const REGEX_TELEFONE = /^\(?\d{2}\)?[\s-]?(?:9\d{4}|\d{4})-?\d{4}$/;

const REGEX_CEP = /^\d{5}-?\d{3}$/;

const REGEX_SITE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}([/?#].*)?$/i;

function textoObrigatorio(valor: string, tamanhoMinimo = 1): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return "Este campo é obrigatório.";
  if (limpo.length < tamanhoMinimo) {
    return `Digite pelo menos ${tamanhoMinimo} caracteres.`;
  }
  return null;
}

export function validarNome(valor: string): string | null {
  return textoObrigatorio(valor, 3);
}

export function validarCategoria(valor: string): string | null {
  return textoObrigatorio(valor);
}

export function validarDescricao(valor: string): string | null {
  return textoObrigatorio(valor, 10);
}

export function validarLogradouro(valor: string): string | null {
  return textoObrigatorio(valor, 3);
}

export function validarNumero(valor: string): string | null {
  return textoObrigatorio(valor);
}

export function validarBairro(valor: string): string | null {
  return textoObrigatorio(valor, 2);
}

export function validarCidade(valor: string): string | null {
  return textoObrigatorio(valor, 2);
}

export function validarEstado(valor: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return "Selecione um estado.";
  if (!/^[A-Z]{2}$/.test(limpo)) return "Selecione uma UF válida.";
  return null;
}

export function validarCep(valor: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return "O CEP é obrigatório.";
  if (!REGEX_CEP.test(limpo)) {
    return "Digite um CEP válido, no formato 00000-000.";
  }
  return null;
}

export function validarEmail(valor: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return "O e-mail é obrigatório.";
  if (!REGEX_EMAIL.test(limpo)) {
    return "Digite um e-mail válido, como nome@exemplo.com.";
  }
  return null;
}

export function validarTelefone(valor: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return null; // telefone é opcional
  if (!REGEX_TELEFONE.test(limpo)) {
    return "Digite um telefone válido, como (11) 91234-5678.";
  }
  return null;
}

export function validarSite(valor: string): string | null {
  const limpo = valor.trim();
  if (limpo.length === 0) return null; // site é opcional
  if (!REGEX_SITE.test(limpo)) {
    return "Digite um endereço de site válido, como https://exemplo.com.";
  }
  return null;
}

const VALIDADORES: Record<CampoCadastro, (valor: string) => string | null> = {
  nome: validarNome,
  categoria: validarCategoria,
  descricao: validarDescricao,
  logradouro: validarLogradouro,
  numero: validarNumero,
  bairro: validarBairro,
  cidade: validarCidade,
  estado: validarEstado,
  cep: validarCep,
  email: validarEmail,
  telefone: validarTelefone,
  site: validarSite,
};


export function validarCampo(campo: CampoCadastro, valor: string): string | null {
  return VALIDADORES[campo](valor);
}


export function validarFormulario(dados: DadosFormularioLocal): ErrosCadastro {
  const erros: ErrosCadastro = {};

  (Object.keys(VALIDADORES) as CampoCadastro[]).forEach((campo) => {
    const valorBruto = (dados as unknown as Record<string, unknown>)[campo];
    const mensagem = validarCampo(campo, String(valorBruto ?? ""));
    if (mensagem) {
      erros[campo] = mensagem;
    }
  });

  return erros;
}

export function formularioValido(erros: ErrosCadastro): boolean {
  return Object.keys(erros).length === 0;
}