import { useState, type ReactNode } from "react";
import { locais as locaisIniciais } from "./data/locais";
import { LocaisContext } from "./LocaisContext";
import type { Local } from "./types/local";

export function LocaisProvider({ children }: { children: ReactNode }) {
  const [locais, setLocais] = useState<Local[]>(() => [...locaisIniciais]);

  const adicionarLocal = (local: Local) => {
    setLocais((atuais) => [...atuais, local]);
  };

  return (
    <LocaisContext.Provider value={{ locais, adicionarLocal }}>
      {children}
    </LocaisContext.Provider>
  );
}
