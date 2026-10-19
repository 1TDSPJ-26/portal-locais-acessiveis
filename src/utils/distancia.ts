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
