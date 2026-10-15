import { createContext } from "react";
import type { DadosCadastroLocal } from "./services/cadastroLocal";
import type { MotivoErro } from "./services/erros";
import type { Local } from "./types/local";

export type EstadoLocais = "carregando" | "pronto" | "erro";

export interface LocaisContextValue {
  locais: Local[];
  estado: EstadoLocais;
  usandoReserva: boolean;
  /** Motivo da falha quando usandoReserva é true. Undefined quando carregou normalmente. */
  motivoErro?: MotivoErro;
  tentarNovamente: () => void;
  cadastrarLocal: (dados: DadosCadastroLocal) => Local;
  atualizarLocal: (id: number, dados: DadosCadastroLocal) => Local;
  removerLocal: (id: number) => void;
}

export const LocaisContext = createContext<LocaisContextValue | null>(null);
