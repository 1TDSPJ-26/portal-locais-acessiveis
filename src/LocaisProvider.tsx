import { useRef, useState, type ReactNode } from "react";
import { locais as locaisIniciais } from "./data/locais";
import { LocaisContext } from "./LocaisContext";
import { criarLocal, type DadosCadastroLocal } from "./services/cadastroLocal";
import type { Local } from "./types/local";

export function LocaisProvider({ children }: { children: ReactNode }) {
  const [locais, setLocais] = useState<Local[]>(() => [...locaisIniciais]);
  const locaisAtuais = useRef(locais);

  const cadastrarLocal = (dados: DadosCadastroLocal) => {
    const novoLocal = criarLocal(locaisAtuais.current, dados);
    const atualizados = [...locaisAtuais.current, novoLocal];
    locaisAtuais.current = atualizados;
    setLocais(atualizados);
    return novoLocal;
  };

  return (
    <LocaisContext.Provider value={{ locais, cadastrarLocal }}>
      {children}
    </LocaisContext.Provider>
  );
}
