import { useRef, useState } from "react";
import { useLocais } from "../../useLocais";
import { useFavoritos } from "../../useFavoritos";
import { ordenarLocais } from "../../utils/ordenar-locais";
import { LocalCard } from "../../components/LocalCard";
import Mensagem from "../../components/Mensagem";
import FavoritosVazio from "../../components/FavoritosVazio";
import type { Local } from "../../types/local";

export default function FavoritosPage() {
  const { locais, estado, usandoReserva, tentarNovamente } = useLocais();
  const { ehFavorito } = useFavoritos();
  const tituloListaRef = useRef<HTMLHeadingElement>(null);
  const [mensagemRemocao, setMensagemRemocao] = useState("");
  const favoritos = ordenarLocais(
    locais.filter((local) => ehFavorito(local.id)),
    "nome",
  );

  const anunciarRemocao = (local: Local) => {
    setMensagemRemocao(`Local ${local.nome} (${local.endereco}) removido dos favoritos.`);
    // O título permanece na página mesmo quando o último cartão é removido.
    tituloListaRef.current?.focus();
  };

  return (
    <div className="app-shell">
      <title>Favoritos | Portal de Locais e Serviços Acessíveis</title>

      <header className="hero">
        <h1>Meus favoritos</h1>
      </header>

      <section className="content" aria-labelledby="titulo-lista-favoritos">
        <div className="results-heading">
          <h2 id="titulo-lista-favoritos" ref={tituloListaRef} tabIndex={-1}>
            {estado === "pronto"
              ? `${favoritos.length} ${favoritos.length === 1 ? "local favorito" : "locais favoritos"}`
              : "Locais favoritos"}
          </h2>
        </div>

        <Mensagem tipo="sucesso" className="delete-notice">
          {mensagemRemocao}
        </Mensagem>

        <output
          aria-live="polite"
          className={estado === "carregando" ? "empty-state" : "sr-only"}
        >
          {estado === "carregando" ? "Carregando locais..." : ""}
        </output>

        <Mensagem
          tipo="aviso"
          className={estado === "pronto" && usandoReserva ? "empty-state" : undefined}
        >
          {estado === "pronto" && usandoReserva && (
            <>
              <h2>Exibindo dados de reserva</h2>
              <p>
                Não foi possível carregar os locais salvos. A lista exibida
                contém os dados de reserva do projeto, e não a lista salva.
              </p>
              <button className="botao botao--secundario" type="button" onClick={tentarNovamente}>
                Tentar novamente
              </button>
            </>
          )}
        </Mensagem>

        <Mensagem tipo="erro" className={estado === "erro" ? "empty-state" : undefined}>
          {estado === "erro" && (
            <>
              <h2>Não foi possível carregar os locais</h2>
              <p>Tente novamente para consultar os locais disponíveis.</p>
              <button className="botao botao--secundario" type="button" onClick={tentarNovamente}>
                Tentar novamente
              </button>
            </>
          )}
        </Mensagem>

        {estado === "pronto" && (
          favoritos.length > 0 ? (
            <div className="places-grid">
              {favoritos.map((local) => (
                <LocalCard key={local.id} local={local} onDesfavoritar={anunciarRemocao} />
              ))}
            </div>
          ) : (
           <FavoritosVazio/>
          )
        )}
      </section>
    </div>
  );
}
