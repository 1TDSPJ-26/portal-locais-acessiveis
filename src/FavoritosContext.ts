import { createContext } from "react";

export interface FavoritosContextValue {
  favoritos: number[];
  ehFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => void;
  totalFavoritos: number;
}

export const FavoritosContext = createContext<FavoritosContextValue | null>(null);
