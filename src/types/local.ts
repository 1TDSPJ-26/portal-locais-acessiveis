export const CATEGORIAS_LOCAL = [
  'restaurante',
  'cafe',
  'parque',
  'museu',
  'biblioteca',
  'outro',
] as const;

export type CategoriaLocal = (typeof CATEGORIAS_LOCAL)[number];

export const ROTULOS_CATEGORIA: Record<CategoriaLocal, string> = {
  restaurante: 'Restaurante',
  cafe: 'Café',
  parque: 'Parque',
  museu: 'Museu',
  biblioteca: 'Biblioteca',
  outro: 'Outro',
};

export const UFS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type UnidadeFederativa = (typeof UFS_BRASIL)[number];

export interface DadosFormularioLocal {
  // Identificação
  nome: string;
  categoria: CategoriaLocal;
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
  rampaAcesso: boolean;
  banheiroAdaptado: boolean;
  sinalizacaoTatil: boolean;
  pisoTatil: boolean;
  vagasPreferenciais: boolean;
  // Contato
  email: string;
  telefone: string;
  site: string;
}

export const DADOS_INICIAIS: DadosFormularioLocal = {
  nome: '',
  categoria: 'restaurante',
  descricao: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  rampaAcesso: false,
  banheiroAdaptado: false,
  sinalizacaoTatil: false,
  pisoTatil: false,
  vagasPreferenciais: false,
  email: '',
  telefone: '',
  site: '',
};