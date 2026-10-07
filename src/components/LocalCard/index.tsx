import { Link } from "react-router";
import type { Local } from "../../types/local";

type LocalCardProps = {
  local: Local;
};

export function LocalCard({ local }: LocalCardProps) {
  const idTituloRecursos = `recursos-local-${local.id}`;

  return (
    <article className="place-card">
      <div className="place-card-top">
        <span className="place-category">{local.categoria}</span>
      </div>
      <h3>
        <Link to={`/locais/${local.id}`}>{local.nome}</Link>
      </h3>
      <p className="place-address">{local.endereco}</p>
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