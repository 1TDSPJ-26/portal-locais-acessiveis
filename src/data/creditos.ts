export type Pessoa = {
  nome: string
  github: string
}

export const turma = 'Turma TDSPJ'
export const curso = 'Análise e Desenvolvimento de Sistemas'

export const professorOrientador: Pessoa = {
  nome: 'Alexandre Carlos',
  github: 'alecarlosjesus',
}

export const integrantes: Pessoa[] = [
  { nome: 'Pedro Andreotti Pugliesi', github: 'PedroAndreottiPugliesi' }
]

export const tecnologias = [
  'React 19',
  'React Router 8',
  'TypeScript 6',
  'Vite 8',
  'Tailwind CSS 4',
] as const

export const urlRepositorio =
  'https://github.com/1TDSPJ-26/portal-locais-acessiveis'

export const urlPerfilGithub = (github: string) =>
  `https://github.com/${github}`