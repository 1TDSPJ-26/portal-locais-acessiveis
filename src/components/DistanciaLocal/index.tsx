import { useLocalizacao } from "../../useLocalizacao";
import type { Local } from "../../types/local";
import {
  calcularDistanciaKm,
  formatarDistancia,
  formatarDistanciaPorExtenso,
} from "../../utils/distancia";

type DistanciaLocalProps = {
  local: Local;
};

export function DistanciaLocal({ local }: DistanciaLocalProps) {
  const { posicao } = useLocalizacao();

  if (!posicao) return null;

  if (local.latitude == null || local.longitude == null) {
    return <p className="place-distance">Distância indisponível</p>;
  }

  const km = calcularDistanciaKm(posicao, {
    latitude: local.latitude,
    longitude: local.longitude,
  });

  return (
    <p className="place-distance">
      <span aria-hidden="true">Aproximadamente {formatarDistancia(km)}</span>
      <span className="sr-only">
        Aproximadamente {formatarDistanciaPorExtenso(km)}
      </span>
    </p>
  );
}