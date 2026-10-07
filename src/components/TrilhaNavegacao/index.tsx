import { Link } from "react-router";

export type NivelTrilha = {
  rotulo: string;
  destino?: string;
};

type TrilhaNavegacaoProps = {
  niveis: NivelTrilha[];
};

export function TrilhaNavegacao({ niveis }: TrilhaNavegacaoProps) {
  return (
    <nav aria-label="Trilha de navegação" className="trilha-navegacao">
      <ol>
        {niveis.map((nivel, indice) => {
          const ultimo = indice === niveis.length - 1;

          return (
            <li key={`${indice}-${nivel.rotulo}`}>
              {ultimo || !nivel.destino ? (
                <span aria-current={ultimo ? "page" : undefined}>
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