import { locais } from "../data/locais.ts";
import type { Local } from "../types/local";
import { carregarLocaisSalvos } from "../persistenciaLocais.ts";
import { ErroCarregamentoLocais } from "./erros.ts";
import type { MotivoErro } from "./erros.ts";

export { ErroCarregamentoLocais } from "./erros.ts";
export type { MotivoErro } from "./erros.ts";

/** Usa uma cópia da reserva se a carga falhar, sem gravar no armazenamento. */
export async function carregarComReserva(
  carregar: () => Promise<Local[]>,
  reserva: Local[],
): Promise<{ locais: Local[]; usandoReserva: boolean; motivo?: MotivoErro }> {
  try {
    return { locais: await carregar(), usandoReserva: false };
  } catch (erro) {
    console.error("Não foi possível carregar os locais salvos.", erro);

    const motivo: MotivoErro =
      erro instanceof ErroCarregamentoLocais ? erro.motivo : "desconhecido";

    // Uma falha ao copiar a reserva é propagada para o estado de erro do chamador.
    return {
      locais: reserva.map((local) => ({ ...local, recursos: [...local.recursos] })),
      usandoReserva: true,
      motivo,
    };
  }
}

/** Simula uma carga assíncrona: usa a lista salva ou, sem ela, os dados de exemplo. */
export async function carregarLocais(): Promise<Local[]> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  const salvos = carregarLocaisSalvos();
  if (salvos) return salvos;

  // Cada carga recebe sua própria lista, inclusive os recursos de cada local.
  return locais.map((local) => ({ ...local, recursos: [...local.recursos] }));
}
