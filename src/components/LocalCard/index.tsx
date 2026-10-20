import { Link, useLocation } from "react-router";
import type { Local } from "../../types/local";
import { BotaoFavorito } from "../BotaoFavorito";
import { DistanciaLocal } from "../DistanciaLocal";

type LocalCardProps = {
  local: Local;
  onDesfavoritar?: (local: Local) => void;
};

export function LocalCard({ local, onDesfavoritar }: LocalCardProps) {
  const idTituloRecursos = `recursos-local-${local.id}`;
  const location = useLocation();
  const origemListagem = { pathname: "/locais" as const, search: location.search };
  

  return (
    <article className="place-card">
      <div className="place-card-top">
        <span className="place-category">{local.categoria}</span>
      </div>
      <h3>
        <Link to={`/locais/${local.id}`} state={{ origemListagem }}>{local.nome}</Link>
      </h3>
      <BotaoFavorito local={local} onDesfavoritar={onDesfavoritar} />
      <div className="place-card-details">
        <p className="place-address">{local.endereco}</p>
        <DistanciaLocal local={local} />
      </div>

      {local.recursos.length > 0 && (
        <>
          <span id={idTituloRecursos} className="sr-only">
            Recursos de acessibilidade de {local.nome}
          </span>
          <ul aria-labelledby={idTituloRecursos}>
            {local.recursos.map((recurso) => (
              <li key={recurso}>{recurso}</li>
            ))}
          </ul>
        </>
      )}
    </article>
  );
  
}
