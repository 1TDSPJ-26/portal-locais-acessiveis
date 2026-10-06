import { locais } from "../data/locais.ts";
import type { Local } from "../types/local";

/** Simula uma carga assíncrona sem acessar API ou persistência. */
export async function carregarLocais(): Promise<Local[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  // Cada carga recebe sua própria lista, inclusive os recursos de cada local.
  return locais.map((local) => ({ ...local, recursos: [...local.recursos] }));
}
