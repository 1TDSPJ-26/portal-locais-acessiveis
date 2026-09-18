import { createContext } from "react";
import type { DadosCadastroLocal } from "./services/cadastroLocal";
import type { Local } from "./types/local";

export interface LocaisContextValue {
  locais: Local[];
  cadastrarLocal: (dados: DadosCadastroLocal) => Local;
}

export const LocaisContext = createContext<LocaisContextValue | null>(null);
