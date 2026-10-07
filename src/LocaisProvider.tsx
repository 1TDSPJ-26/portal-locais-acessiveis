import { useEffect, useState, type ReactNode } from "react";
import { LocaisContext, type EstadoLocais } from "./LocaisContext";
import {
  criarLocal,
  editarLocal,
  type DadosCadastroLocal,
} from "./services/cadastroLocal";
import { carregarLocais } from "./services/locais";
import type { Local } from "./types/local";

interface LocaisProviderProps {
  children: ReactNode;
  // Permite reproduzir falhas e lista vazia em testes sem alterar o serviço.
  carregar?: () => Promise<Local[]>;
}

export function LocaisProvider({
  children,
  carregar = carregarLocais,
}: LocaisProviderProps) {
  const [locais, setLocais] = useState<Local[]>([]);
  const [estado, setEstado] = useState<EstadoLocais>("carregando");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarLista() {
      try {
        const dados = await carregar();
        if (ativo) {
          setLocais(dados);
          setEstado("pronto");
        }
      } catch {
        if (ativo) setEstado("erro");
      }
    }

    void carregarLista();
    // Descarta respostas de efeitos desmontados, inclusive no StrictMode.
    return () => { ativo = false; };
  }, [carregar, tentativa]);

  const tentarNovamente = () => {
    setEstado("carregando");
    setTentativa((atual) => atual + 1);
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

  const atualizarLocal = (id: number, dados: DadosCadastroLocal) => {
    if (estado !== "pronto") {
      throw new Error("Aguarde o carregamento dos locais antes de editar.");
    }

    const locaisAtualizados = editarLocal(locais, id, dados);
    setLocais(locaisAtualizados);

    const localAtualizado = locaisAtualizados.find((local) => local.id === id);
    if (!localAtualizado) {
      throw new Error("Local não encontrado após atualização.");
    }

    return localAtualizado;
  };

  return (
    <LocaisContext.Provider value={{ locais, estado, tentarNovamente, cadastrarLocal, atualizarLocal }}>
      {children}
    </LocaisContext.Provider>
  );
}
