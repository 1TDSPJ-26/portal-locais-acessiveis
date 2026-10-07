import type { Local } from "../types/local"

export type CriterioOrdenacao = "nome" | "categoria"

const comparar = (a: string, b: string) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" })

export const ordenarLocais = (locais: Local[], criterio: CriterioOrdenacao): Local[] =>
    locais.toSorted((a, b) => {
        if (criterio === "categoria") {
            const porCategoria = comparar(a.categoria, b.categoria)
            if (porCategoria !== 0) return porCategoria
        }
        return comparar(a.nome, b.nome)
    })