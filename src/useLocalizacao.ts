import { useContext } from "react"
import { LocalizacaoContext } from "./LocalizacaoContext"

export function useLocalizacao() {
  const contexto = useContext(LocalizacaoContext)

  if (contexto === null) {
    throw new Error(
      "useLocalizacao deve ser utilizado dentro de LocalizacaoProvider.",
    )
  }

  return contexto
}
