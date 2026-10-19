import { createContext } from "react"

export interface Posicao {
    latitude: number
    longitude: number
}

export type EstadoLocalizacao = "inativo" | "buscando" | "obtida" | "erro"
export type ErroLocalizacao = "permissao-negada" | "indisponivel" | "tempo-esgotado" | "nao-suportado"

export interface LocalizacaoContextData {
    estado: EstadoLocalizacao
    posicao: Posicao | null
    erro: ErroLocalizacao | null
    solicitar: () => void
}

export const LocalizacaoContext =
    createContext<LocalizacaoContextData | null>(null)