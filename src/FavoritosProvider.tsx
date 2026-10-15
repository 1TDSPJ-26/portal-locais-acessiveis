import { useEffect, useState, type ReactNode } from "react";
import { FavoritosContext } from "./FavoritosContext";
import {
  alternarFavorito as alternarIdFavorito,
  carregarFavoritos,
  salvarFavoritos,
} from "./favoritos";
import { useLocais } from "./useLocais";

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const { locais, estado, usandoReserva } = useLocais();
  const [favoritos, setFavoritos] = useState<number[]>(carregarFavoritos);

  // A lista ainda incompleta ou de reserva não comprova uma exclusão.
  // Ajusta apenas quando há IDs removidos, antes de renderizar os consumidores.
  if (estado === "pronto" && !usandoReserva) {
    const idsExistentes = new Set(locais.map((local) => local.id));
    const restantes = favoritos.filter((id) => idsExistentes.has(id));
    if (restantes.length !== favoritos.length) setFavoritos(restantes);
  }

  useEffect(() => {
    salvarFavoritos(favoritos);
  }, [favoritos]);

  const ehFavorito = (id: number) => favoritos.includes(id);
  const alternarFavorito = (id: number) => {
    setFavoritos((atuais) => alternarIdFavorito(atuais, id));
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, ehFavorito, alternarFavorito, totalFavoritos: favoritos.length }}>
      {children}
    </FavoritosContext.Provider>
  );
}
