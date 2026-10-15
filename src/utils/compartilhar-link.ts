export type ResultadoCompartilhamento =
  | "compartilhado"
  | "copiado"
  | "cancelado"
  | "falhou";

export type RecursosCompartilhamento = {
  share?: (dados: {
    title: string;
    url: string;
  }) => Promise<void>;

  writeText?: (texto: string) => Promise<void>;
};

function ehAbortError(erro: unknown): boolean {
  return (
    typeof erro === "object" &&
    erro !== null &&
    "name" in erro &&
    erro.name === "AbortError"
  );
}

export async function compartilharLink(
  titulo: string,
  url: string,
  recursos: RecursosCompartilhamento,
): Promise<ResultadoCompartilhamento> {
  if (recursos.share) {
    try {
      await recursos.share({
        title: titulo,
        url,
      });

      return "compartilhado";
    } catch (erro) {
      if (ehAbortError(erro)) {
        return "cancelado";
      }

      return "falhou";
    }
  }

  if (recursos.writeText) {
    try {
      await recursos.writeText(url);

      return "copiado";
    } catch {
      return "falhou";
    }
  }

  return "falhou";
}