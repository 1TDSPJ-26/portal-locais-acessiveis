import { createContext } from "react";
import type { Local } from "./types/local";

export interface LocaisContextValue {
  locais: Local[];
  adicionarLocal: (local: Local) => void;
}

export const LocaisContext = createContext<LocaisContextValue | null>(null);
