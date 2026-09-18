import { useState, type ReactNode } from "react";
import { locais as locaisIniciais } from "./data/locais";
import { LocaisContext } from "./LocaisContext";
import { criarLocal, type DadosCadastroLocal } from "./services/cadastroLocal";
import type { Local } from "./types/local";

export function LocaisProvider({ children }: { children: ReactNode }) {
  const [locais, setLocais] = useState<Local[]>(() => [...locaisIniciais]);

  /* Fonte unica: o estado. `criarLocal` le a lista do render corrente para
     conferir duplicidade e gerar o identificador, e o acrescimo usa a forma
     funcional do atualizador. Guardar a lista tambem num `useRef` deixaria
     duas fontes que podem divergir, que e o risco apontado pela Issue #17. */
  const cadastrarLocal = (dados: DadosCadastroLocal) => {
    const novoLocal = criarLocal(locais, dados);
    setLocais((anteriores) => [...anteriores, novoLocal]);
    return novoLocal;
  };

  return (
    <LocaisContext.Provider value={{ locais, cadastrarLocal }}>
      {children}
    </LocaisContext.Provider>
  );
}
