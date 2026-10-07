import { Link } from "react-router";

export interface NivelTrilha {
  rotulo: string;
  destino?: string;
}

interface TrilhaNavegacaoProps {
  niveis: NivelTrilha[];
}

export default function TrilhaNavegacao({ niveis }: TrilhaNavegacaoProps) {
  return (
    <nav aria-label="Trilha de navegação" className="trilha-navegacao">
      <ol>
        {niveis.map((nivel, indice) => {
          const ehUltimo = indice === niveis.length - 1;

          return (
            <li key={`${indice}-${nivel.rotulo}`}>
              {ehUltimo || !nivel.destino ? (
                <span aria-current={ehUltimo ? "page" : undefined}>
                  {nivel.rotulo}
                </span>
              ) : (
                <Link to={nivel.destino}>{nivel.rotulo}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}