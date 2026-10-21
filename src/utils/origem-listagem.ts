export type OrigemListagem = {
  pathname: "/locais";
  search: string;
};

export const origemListagemPadrao: OrigemListagem = {
  pathname: "/locais",
  search: "",
};

export function obterOrigemListagem(estado: unknown): OrigemListagem {
  if (typeof estado !== "object" || estado === null) {
    return origemListagemPadrao;
  }

  const origem = (estado as { origemListagem?: unknown }).origemListagem;
  if (
    typeof origem !== "object" ||
    origem === null ||
    (origem as { pathname?: unknown }).pathname !== "/locais" ||
    typeof (origem as { search?: unknown }).search !== "string"
  ) {
    return origemListagemPadrao;
  }

  const search = (origem as { search: string }).search;
  return { pathname: "/locais", search: search.startsWith("?") ? search : "" };
}
