// Entrada opcional do Vite para estados que não dependem de falhas reais.
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { LocaisContext, type EstadoLocais } from "../../src/LocaisContext";
import { FavoritosProvider } from "../../src/FavoritosProvider";
import Favoritos from "../../src/pages/Favoritos";
import { locais } from "../../src/data/locais";
import "../../src/index.css";

const cenario = new URLSearchParams(location.search).get("cenario");
export function CenarioFavoritos() {
  const [estado, setEstado] = useState<EstadoLocais>(cenario === "erro" ? "erro" : "carregando");
  useEffect(() => {
    if (cenario !== "carregando") return;
    const timer = setTimeout(() => setEstado("pronto"), 2000);
    return () => clearTimeout(timer);
  }, []);
  const somenteLeitura = () => { throw new Error("Operação fora desta fixture"); };
  return (
    <MemoryRouter initialEntries={["/favoritos"]}>
      <LocaisContext.Provider value={{ locais: estado === "pronto" ? locais : [], estado,
        usandoReserva: false, tentarNovamente: () => setEstado("pronto"),
        cadastrarLocal: somenteLeitura, atualizarLocal: somenteLeitura, removerLocal: somenteLeitura }}>
        <FavoritosProvider><Favoritos /></FavoritosProvider>
      </LocaisContext.Provider>
    </MemoryRouter>
  );
}
createRoot(document.getElementById("root")!).render(<CenarioFavoritos />);
