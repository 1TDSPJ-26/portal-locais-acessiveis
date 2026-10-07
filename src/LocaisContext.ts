import { createContext } from "react";
import type { DadosCadastroLocal } from "./services/cadastroLocal";
import type { Local } from "./types/local";

export type EstadoLocais = "carregando" | "pronto" | "erro";

export interface LocaisContextValue {
  locais: Local[];
  estado: EstadoLocais;
  tentarNovamente: () => void;
  cadastrarLocal: (dados: DadosCadastroLocal) => Local;
  atualizarLocal: (id: number, dados: DadosCadastroLocal) => Local;
  removerLocal: (id: number) => void;
}

export const LocaisContext = createContext<LocaisContextValue | null>(null);
