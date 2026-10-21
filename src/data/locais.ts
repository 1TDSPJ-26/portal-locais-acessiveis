import type { Local } from '../types/local'

// Coordenadas fictícias distribuídas por regiões simuladas da cidade.
// Não representam a localização real dos estabelecimentos.

export const locais: Local[] = [
  { id: 1, nome: 'Biblioteca Parque', categoria: 'Cultura', endereco: 'Rua das Palmeiras, 120 · Centro', latitude: -23.5505, longitude: -46.6333, recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Piso tátil'] },
  { id: 2, nome: 'Café Aurora', categoria: 'Alimentação', endereco: 'Avenida Central, 48 · Vila Nova', latitude: -23.5680, longitude: -46.6750, recursos: ['Entrada sem degraus', 'Banheiro acessível'] },
  { id: 3, nome: 'Museu da Cidade', categoria: 'Cultura', endereco: 'Praça da Estação, 8 · Centro', latitude: -23.5470, longitude: -46.6290, recursos: ['Entrada sem degraus', 'Piso tátil', 'Libras', 'Audiodescrição'] },
  { id: 4, nome: 'Parque das Águas', categoria: 'Lazer', endereco: 'Avenida das Flores, 600 · Jardim Sul', latitude: -23.6250, longitude: -46.6900, recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Piso tátil'] },
  { id: 5, nome: 'Centro de Atendimento Cidadão', categoria: 'Serviços', endereco: 'Rua do Mercado, 31 · Centro', latitude: -23.5560, longitude: -46.6400, recursos: ['Entrada sem degraus', 'Banheiro acessível', 'Libras'] },
  { id: 6, nome: 'Cine Horizonte', categoria: 'Lazer', endereco: 'Rua Aurora, 210 · Vila Nova', latitude: -23.5750, longitude: -46.6820, recursos: ['Entrada sem degraus', 'Audiodescrição', 'Libras'] },
]