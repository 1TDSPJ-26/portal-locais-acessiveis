import type { Local } from '../types/local'

export const locais: Local[] = [
  { id: 1, nome: 'Biblioteca Parque', categoria: 'Cultura', endereco: 'Rua das Palmeiras, 120 · Centro', recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Piso tátil'] },
  { id: 2, nome: 'Café Aurora', categoria: 'Alimentação', endereco: 'Avenida Central, 48 · Vila Nova', recursos: ['Entrada sem degraus', 'Banheiro acessível'] },
  { id: 3, nome: 'Museu da Cidade', categoria: 'Cultura', endereco: 'Praça da Estação, 8 · Centro', recursos: ['Entrada sem degraus', 'Piso tátil', 'Libras', 'Audiodescrição'] },
  { id: 4, nome: 'Parque das Águas', categoria: 'Lazer', endereco: 'Avenida das Flores, 600 · Jardim Sul', recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Piso tátil'] },
  { id: 5, nome: 'Centro de Atendimento Cidadão', categoria: 'Serviços', endereco: 'Rua do Mercado, 31 · Centro', recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Libras'] },
  { id: 6, nome: 'Cine Horizonte', categoria: 'Lazer', endereco: 'Rua Aurora, 210 · Vila Nova', recursos: ['Entrada sem degraus', 'Audiodescrição', 'Libras'] },
]