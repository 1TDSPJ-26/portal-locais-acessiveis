import { locais } from "../data/locais.ts";
import type { Local } from "../types/local";
import { carregarLocaisSalvos } from "../persistenciaLocais.ts";

/** Simula uma carga assíncrona: usa a lista salva ou, sem ela, os dados de exemplo. */
export async function carregarLocais(): Promise<Local[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  const salvos = carregarLocaisSalvos();
  if (salvos) return salvos;

  // Cada carga recebe sua própria lista, inclusive os recursos de cada local.
  return locais.map((local) => ({ ...local, recursos: [...local.recursos] }));
}
