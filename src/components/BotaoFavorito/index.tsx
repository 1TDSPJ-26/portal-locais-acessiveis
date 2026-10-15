import type { Local } from "../../types/local";
import { useFavoritos } from "../../useFavoritos";

type BotaoFavoritoProps = {
  local: Local;
};

export function BotaoFavorito({ local }: BotaoFavoritoProps) {
  const { ehFavorito, alternarFavorito } = useFavoritos();
  const favorito = ehFavorito(local.id);

  return (
    <button
      type="button"
      className="botao botao--secundario"
      aria-label={`Favoritar ${local.nome}`}
      aria-pressed={favorito}
      onClick={() => alternarFavorito(local.id)}
    >
      <span aria-hidden="true">{favorito ? "★" : "☆"}</span>
      <span>Favoritar</span>
      <span aria-hidden="true">
        {favorito ? "(favoritado)" : "(não favoritado)"}
      </span>
    </button>
  );
}
