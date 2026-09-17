export const categoriasLocais = ['Cultura', 'Alimentação', 'Lazer', 'Serviços'] as const
export type CategoriaLocal = (typeof categoriasLocais)[number]

export const recursosAcessibilidade = ['Entrada sem degraus', 'Banheiro acessível', 'Piso tátil', 'Libras', 'Audiodescrição'] as const
export type RecursoAcessibilidade = (typeof recursosAcessibilidade)[number]

export interface Local {
  id: number
  nome: string
  categoria: CategoriaLocal
  endereco: string
  recursos: RecursoAcessibilidade[]
}

export interface FiltrosLocais {
  categoria: CategoriaLocal | ''
  recursos: RecursoAcessibilidade[]
}