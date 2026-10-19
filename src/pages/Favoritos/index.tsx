import { useLocais } from "../../useLocais";
import { useFavoritos } from "../../useFavoritos";
import { ordenarLocais } from "../../utils/ordenar-locais";
import { LocalCard } from "../../components/LocalCard";
import Mensagem from "../../components/Mensagem";

export default function FavoritosPage() {
  const { locais, estado, usandoReserva, tentarNovamente } = useLocais();
  const { ehFavorito } = useFavoritos();
  const favoritos = ordenarLocais(
    locais.filter((local) => ehFavorito(local.id)),
    "nome",
  );

  return (
    <div className="app-shell">
      <title>Favoritos | Portal de Locais e Serviços Acessíveis</title>

      <header className="hero">
        <h1>Meus favoritos</h1>
      </header>

      <section className="content" aria-labelledby="titulo-lista-favoritos">
        <div className="results-heading">
          <h2 id="titulo-lista-favoritos">
            {estado === "pronto"
              ? `${favoritos.length} ${favoritos.length === 1 ? "local favorito" : "locais favoritos"}`
              : "Locais favoritos"}
          </h2>
        </div>

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
                <LocalCard key={local.id} local={local} />
              ))}
            </div>
          ) : (
            <p className="empty-state">Você ainda não tem locais favoritos nesta lista.</p>
          )
        )}
      </section>
    </div>
  );
}
