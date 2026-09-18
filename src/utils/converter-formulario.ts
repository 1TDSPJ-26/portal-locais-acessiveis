import type { DadosCadastroLocal } from '../services/cadastroLocal'
import type { DadosFormularioLocal } from '../types/local'

/* O formulario desmembra o endereco em varios campos, enquanto o local da
   listagem guarda uma linha unica. Partes vazias sao descartadas para nao
   deixar separador solto, como em "Rua das Flores, 10 · · Centro". */
const juntar = (separador: string, partes: string[]) =>
  partes
    .map((parte) => parte.trim())
    .filter((parte) => parte.length > 0)
    .join(separador)

export function montarEndereco(dados: DadosFormularioLocal): string {
  const rua = juntar(', ', [dados.logradouro, dados.numero, dados.complemento])
  const cidadeComUf = juntar(' - ', [dados.cidade, dados.estado])
  const cep = dados.cep.trim() ? `CEP ${dados.cep.trim()}` : ''

  return juntar(' · ', [rua, dados.bairro, cidadeComUf, cep])
}

/* Campo em branco vira ausente, e nao texto vazio, para que o local cadastrado
   fique igual aos de exemplo, que simplesmente nao declaram esses campos. */
const opcional = (valor: string) => {
  const limpo = valor.trim()
  return limpo.length > 0 ? limpo : undefined
}

export function dadosFormularioParaCadastro(
  dados: DadosFormularioLocal,
): DadosCadastroLocal {
  /* A validacao da Issue #16 ja exige a categoria, mas o tipo do formulario
     admite vazio enquanto o usuario nao escolhe. A checagem estreita o tipo e
     deixa o erro visivel caso alguem chame a conversao antes de validar. */
  if (dados.categoria === '') {
    throw new Error('Escolha a categoria antes de cadastrar o local.')
  }

  return {
    nome: dados.nome.trim(),
    categoria: dados.categoria,
    endereco: montarEndereco(dados),
    recursos: [...dados.recursos],
    descricao: opcional(dados.descricao),
    email: opcional(dados.email),
    telefone: opcional(dados.telefone),
    site: opcional(dados.site),
  }
}
