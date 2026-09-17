import type { FiltrosLocais, Local, RecursoAcessibilidade } from "../types/local"

const normalizar = (valor: string) => valor.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')

const atendeRecursos = (local: Local, recursos: RecursoAcessibilidade[]) =>
  recursos.every((recurso) => local.recursos.includes(recurso))

export const filtrarLocais = (locais: Local[], termo: string, filtros: FiltrosLocais) => {
  const busca = normalizar(termo)

  return locais.filter((local) => {
    const correspondeBusca = !busca || normalizar(`${local.nome} ${local.endereco}`).includes(busca)
    const correspondeCategoria = !filtros.categoria || local.categoria === filtros.categoria
    return correspondeBusca && correspondeCategoria && atendeRecursos(local, filtros.recursos)
  })
}