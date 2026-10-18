import {
  categoriasLocais,
  recursosAcessibilidade,
  type CategoriaLocal,
  type RecursoAcessibilidade,
} from "../types/local.ts";

export type FiltroAtivo = {
  tipo: "busca" | "categoria" | "recurso" | "favoritos";
  valor: string;
  rotulo: string;
};

/** Converte os parâmetros da listagem em filtros que podem ser exibidos e removidos. */
export const listarFiltrosAtivos = (params: URLSearchParams): FiltroAtivo[] => {
  const filtros: FiltroAtivo[] = [];
  const busca = params.get("busca")?.trim();
  const categoria = params.get("categoria");

  if (busca) filtros.push({ tipo: "busca", valor: busca, rotulo: `Busca: “${busca}”` });

  if (categoriasLocais.includes(categoria as CategoriaLocal)) {
    filtros.push({ tipo: "categoria", valor: categoria as CategoriaLocal, rotulo: categoria as CategoriaLocal });
  }

  params.getAll("recurso").forEach((recurso) => {
    if (recursosAcessibilidade.includes(recurso as RecursoAcessibilidade)) {
      filtros.push({ tipo: "recurso", valor: recurso, rotulo: recurso });
    }
  });

  if (params.get("favoritos") === "1") {
    filtros.push({ tipo: "favoritos", valor: "1", rotulo: "Somente favoritos" });
  }

  return filtros;
};
