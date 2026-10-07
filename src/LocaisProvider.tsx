import { useEffect, useRef, useState, type ReactNode } from "react";
import { LocaisContext, type EstadoLocais } from "./LocaisContext";
import {
  criarLocal,
  editarLocal,
  type DadosCadastroLocal,
} from "./services/cadastroLocal";
import { carregarLocais } from "./services/locais";
import type { Local } from "./types/local";
import { salvarLocais } from "./persistenciaLocais";

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
  // Guarda o histórico de IDs desta sessão, mesmo quando a lista fica vazia.
  const maiorIdUtilizado = useRef(0);

  useEffect(() => {
    let ativo = true;

    async function carregarLista() {
      try {
        const dados = await carregar();
        if (ativo) {
          maiorIdUtilizado.current = dados.reduce(
            (maior, local) => Math.max(maior, local.id),
            maiorIdUtilizado.current,
          );
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

  /* Risco apontado pela Issue #71: gravar antes de o carregamento terminar
     substituiria a lista salva pela lista vazia inicial. Só grava quando o
     estado for "pronto". */
  useEffect(() => {
    if (estado === "pronto") {
      salvarLocais(locais);
    }
  }, [estado, locais]);

  const tentarNovamente = () => {
    setEstado("carregando");
    setTentativa((atual) => atual + 1);
  };

  /* A lista fica apenas no estado. O ref guarda somente o maior ID utilizado
     para que a exclusão não permita reutilizar links antigos nesta sessão. */
  const cadastrarLocal = (dados: DadosCadastroLocal) => {
    // A carga precisa terminar antes de conferir duplicidade e gerar o ID.
    if (estado !== "pronto") {
      throw new Error("Aguarde o carregamento dos locais antes de cadastrar.");
    }
    const novoLocal = criarLocal(locais, dados, maiorIdUtilizado.current);
    maiorIdUtilizado.current = novoLocal.id;
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
