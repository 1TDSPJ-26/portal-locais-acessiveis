import { useCallback, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { LocalizacaoContext } from "./LocalizacaoContext"
import type { ErroLocalizacao, EstadoLocalizacao, Posicao } from "./LocalizacaoContext"

interface LocalizacaoProviderProps {
    children: ReactNode
}

export function LocalizacaoProvider({
    children,
}: LocalizacaoProviderProps) {
    const [estado, setEstado] = useState<EstadoLocalizacao>("inativo")
    const [posicao, setPosicao] = useState<Posicao | null>(null)
    const [erro, setErro] = useState<ErroLocalizacao | null>(null)

    const solicitar = useCallback(() => {
        if (!navigator.geolocation) {
            setEstado("erro")
            setErro("nao-suportado")
            return
        }

        setEstado("buscando")
        setErro(null)

        navigator.geolocation.getCurrentPosition(
        (resultado) => {
            setPosicao({
                latitude: resultado.coords.latitude,
                longitude: resultado.coords.longitude,
            })
            setEstado("obtida")
            setErro(null)
        },

        (falha) => {
            setEstado("erro")
            setPosicao(null)

            if (falha.code === falha.PERMISSION_DENIED) {
                setErro("permissao-negada")
            } else if (falha.code === falha.POSITION_UNAVAILABLE) {
                setErro("indisponivel")
            } else if (falha.code === falha.TIMEOUT) {
                setErro("tempo-esgotado")
            } else {
                setErro("indisponivel")
            }
        },
        {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 60000,
        },
        )
    }, [])

    const valor = useMemo(() => ({ estado, posicao, erro, solicitar}),
    [estado, posicao, erro, solicitar]
    )

    return (
        <LocalizacaoContext.Provider value={valor}>
            {children}
        </LocalizacaoContext.Provider>
    )
}
