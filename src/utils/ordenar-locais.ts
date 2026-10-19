import type { Local } from "../types/local"
import { calcularDistanciaKm } from "./distancia.ts";

export type CriterioOrdenacao = "nome" | "categoria" | "proximidade"

const comparar = (a: string, b: string) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })

export const ordenarLocais = (locais: Local[], criterio: CriterioOrdenacao, posicao?: { latitude: number; longitude: number }): Local[] =>
    locais.toSorted((a, b) => {
        if (criterio === "categoria") {
            const porCategoria = comparar(a.categoria, b.categoria)
            if (porCategoria !== 0) return porCategoria
        }

        if (criterio === "proximidade" && posicao) {
            const aTemCoordenadas =
                a.latitude !== undefined && a.longitude !== undefined
            const bTemCoordenadas =
                b.latitude !== undefined && b.longitude !== undefined

            if (!aTemCoordenadas) {
                return bTemCoordenadas ? 1 : comparar(a.nome, b.nome)
            }
            
            if (!bTemCoordenadas) return -1
            const distanciaA = calcularDistanciaKm(
                { latitude: a.latitude!, longitude: a.longitude!}, posicao)

            const distanciaB = calcularDistanciaKm(
                { latitude: b.latitude!, longitude: b.longitude!}, posicao)
            return distanciaA - distanciaB
        }
        return comparar(a.nome, b.nome)
    })