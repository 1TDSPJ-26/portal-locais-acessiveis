export interface Coordenadas {
    latitude: number
    longitude: number
}

const RAIO_TERRA_KM = 6371

export function calcularDistanciaKm(origem: Coordenadas, destino: Coordenadas): number {
    const latitudeOrigem = (origem.latitude * Math.PI) / 180
    const latitudeDestino = (destino.latitude * Math.PI) / 180
    const diferencaLatitude = ((destino.latitude - origem.latitude) * Math.PI) / 180
    const diferencaLongitude = ((destino.longitude - origem.longitude) * Math.PI) / 180
    const haversine = Math.sin(diferencaLatitude / 2) ** 2 + Math.cos(latitudeOrigem) * Math.cos(latitudeDestino) * Math.sin(diferencaLongitude / 2) ** 2
    const anguloCentral = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    
    return RAIO_TERRA_KM * anguloCentral
}
const formatadorKm = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

function arredondarMetros(km: number): number {
    return Math.round((km * 1000) / 50) * 50;
}

export function formatarDistancia(km: number): string {
    const metros = arredondarMetros(km);
    if (metros < 1000) return `${metros} m`;
    return `${formatadorKm.format(km)} km`;
}

export function formatarDistanciaPorExtenso(km: number): string {
    const metros = arredondarMetros(km);
    if (metros < 1000) return `${metros} metros`;
    const unidade = Math.round(km * 10) / 10 < 2 ? "quilômetro" : "quilômetros";
    return `${formatadorKm.format(km)} ${unidade}`;
}