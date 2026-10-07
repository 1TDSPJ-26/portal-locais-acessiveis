import { useEffect, useRef, useState, type ReactNode } from "react";
import { LocaisContext, type EstadoLocais } from "./LocaisContext";
import { criarLocal, excluirLocal, type DadosCadastroLocal } from "./services/cadastroLocal";
import { carregarComReserva, carregarLocais } from "./services/locais";
import { locais as locaisReserva } from "./data/locais";
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
  const [usandoReserva, setUsandoReserva] = useState(false);
  const [alteradoPeloUsuario, setAlteradoPeloUsuario] = useState(false);
  // Guarda o histórico de IDs desta sessão, mesmo quando a lista fica vazia.
  const maiorIdUtilizado = useRef(0);

  useEffect(() => {
    let ativo = true;

    async function carregarLista() {
      try {
        const resultado = await carregarComReserva(carregar, locaisReserva);
        const dados = resultado.locais;
        if (ativo) {
          maiorIdUtilizado.current = dados.reduce(
            (maior, local) => Math.max(maior, local.id),
            maiorIdUtilizado.current,
          );
          setLocais(dados);
          setUsandoReserva(resultado.usandoReserva);
          setAlteradoPeloUsuario(false);
          setEstado("pronto");
        }
      } catch (erro) {
        console.error("Não foi possível carregar nem os dados de reserva.", erro);
        if (ativo) setEstado("erro");
      }
    }

    void carregarLista();
    // Descarta respostas de efeitos desmontados, inclusive no StrictMode.
    return () => { ativo = false; };
  }, [carregar, tentativa]);

  // Uma carga de reserva nunca sobrescreve a lista salva sem ação do usuário.
  useEffect(() => {
    if (estado === "pronto" && (!usandoReserva || alteradoPeloUsuario)) {
      salvarLocais(locais);
    }
  }, [estado, locais, usandoReserva, alteradoPeloUsuario]);

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
    setAlteradoPeloUsuario(true);
    return novoLocal;
  };

  const removerLocal = (id: Local["id"]) => {
    if (estado !== "pronto" || !locais.some((local) => local.id === id)) return;
    setLocais((anteriores) => excluirLocal(anteriores, id));
    setAlteradoPeloUsuario(true);
  };

  return (
    <LocaisContext.Provider value={{ locais, estado, usandoReserva, tentarNovamente, cadastrarLocal, removerLocal }}>
      {children}
    </LocaisContext.Provider>
  );
}
