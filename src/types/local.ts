export const categoriasLocais = ['Cultura', 'Alimentação', 'Lazer', 'Serviços'] as const
export type CategoriaLocal = (typeof categoriasLocais)[number]

/* Esta e a unica lista de recursos de acessibilidade do projeto. O formulario
   de cadastro e o painel de filtros da listagem geram seus campos a partir
   dela, de modo que nao podem voltar a divergir. */
export const recursosAcessibilidade = [
  'Entrada sem degraus',
  'Banheiro acessível',
  'Piso tátil',
  'Sinalização tátil',
  'Vagas preferenciais',
  'Libras',
  'Audiodescrição',
] as const
export type RecursoAcessibilidade = (typeof recursosAcessibilidade)[number]

export interface Local {
  id: number
  nome: string
  categoria: CategoriaLocal
  endereco: string
  recursos: RecursoAcessibilidade[]
  /* Preenchidos pelo cadastro. Sao opcionais porque os locais de exemplo em
     `src/data/locais.ts` antecedem o formulario e nao os possuem. */
  descricao?: string
  email?: string
  telefone?: string
  site?: string
}

export interface FiltrosLocais {
  categoria: CategoriaLocal | ''
  recursos: RecursoAcessibilidade[]
}

/* ── Formulário de cadastro ────────────────────────────────────────────────
   A categoria reaproveita `CategoriaLocal`, o mesmo tipo que a listagem e os
   filtros utilizam. Manter duas listas de categoria faria o local cadastrado
   não corresponder a nenhum filtro. Assim como a UF, começa vazia para que a
   escolha seja explícita. */

export const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type UnidadeFederativa = (typeof UFS_BRASIL)[number];

export interface DadosFormularioLocal {
  // Identificação
  nome: string;
  categoria: CategoriaLocal | '';
  descricao: string;
  // Endereço
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: UnidadeFederativa | '';
  cep: string;
  // Recursos de acessibilidade
  recursos: RecursoAcessibilidade[];
  // Contato
  email: string;
  telefone: string;
  site: string;
}

export const DADOS_INICIAIS: DadosFormularioLocal = {
  nome: '',
  categoria: '',
  descricao: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  recursos: [],
  email: '',
  telefone: '',
  site: '',
};
