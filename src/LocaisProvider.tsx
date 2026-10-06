import { useCallback, useEffect, useState, type ReactNode } from "react";
import { locais as locaisIniciais } from "./data/locais";
import { LocaisContext } from "./LocaisContext";
import { criarLocal, type DadosCadastroLocal } from "./services/cadastroLocal";
import { carregarLocais } from "./services/locais";
import type { Local } from "./types/local";
import { salvarLocais } from "./persistenciaLocais";

type EstadoLocais = "carregando" | "pronto" | "erro";

export function LocaisProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoLocais>("carregando");
  const [locais, setLocais] = useState<Local[]>([...locaisIniciais]);

  const carregar = useCallback(() => {
    // Sem setState síncrono aqui: os únicos setEstado ocorrem dentro
    // do then/catch, depois da carga, e o efeito não causa cascata.
    carregarLocais()
      .then((carregados) => {
        setLocais(carregados);
        setEstado("pronto");
      })
      .catch(() => setEstado("erro"));
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /* Risco apontado pela Issue #71: gravar antes de o carregamento terminar
     substituiria a lista salva pelos dados de exemplo. Só grava quando o
     estado for "pronto". */
  useEffect(() => {
    if (estado === "pronto") {
      salvarLocais(locais);
    }
  }, [estado, locais]);

  const tentarNovamente = () => {
    // Evento de clique, não efeito: pode setar estado síncrono sem problema.
    setEstado("carregando");
    carregar();
  };

  /* Fonte unica: o estado. `criarLocal` le a lista do render corrente para
     conferir duplicidade e gerar o identificador, e o acrescimo usa a forma
     funcional do atualizador. Guardar a lista tambem num `useRef` deixaria
     duas fontes que podem divergir, que e o risco apontado pela Issue #17. */
  const cadastrarLocal = (dados: DadosCadastroLocal) => {
    // A carga precisa terminar antes de conferir duplicidade e gerar o ID.
    if (estado !== "pronto") {
      throw new Error("Aguarde o carregamento dos locais antes de cadastrar.");
    }
    const novoLocal = criarLocal(locais, dados);
    setLocais((anteriores) => [...anteriores, novoLocal]);
    return novoLocal;
  };

  return (
    <LocaisContext.Provider
      value={{ locais, estado, tentarNovamente, cadastrarLocal }}
    >
      {children}
    </LocaisContext.Provider>
  );
}