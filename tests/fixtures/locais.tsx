// Entrada exclusiva de teste servida pelo Vite dev; não integra o build.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router";
import { LocaisProvider } from "../../src/LocaisProvider";
import { PreferenciasProvider } from "../../src/PreferenciasProvider";
import { MainLayout } from "../../src/layouts/MainLayout/MainLayout";
import AppRoutes from "../../src/routes/AppRoutes";
import { carregarLocais } from "../../src/services/locais";
import "../../src/index.css";

const parametros = new URLSearchParams(window.location.search);
let cenario = parametros.get("cenario") ?? "pronto";
let cargas = 0;

// Identidade estável: trocar a seleção prepara a próxima tentativa,
// sem provocar uma recarga por mudança da prop do Provider.
async function carregarCenario() {
  const escolhido = cenario;
  const numero = ++cargas;
  if (numero === 1 && (escolhido === "erro-obsoleto" || escolhido === "vazio-obsoleto")) {
    await new Promise<void>((resolve) => setTimeout(resolve, 2000));
    if (escolhido === "erro-obsoleto") throw new Error("Falha do efeito desmontado");
    return [];
  }
  await new Promise<void>((resolve) => setTimeout(resolve, escolhido === "carregando" ? 5000 : 500));
  if (escolhido === "erro") throw new Error("Falha simulada para teste");
  if (escolhido === "vazio") return [];
  return carregarLocais();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MemoryRouter initialEntries={[parametros.get("rota") ?? "/locais"]}>
      <PreferenciasProvider>
        <div className="p-4 text-(--ink) bg-(--card)">
          <label htmlFor="cenario">Teste da issue #70 — cenário da próxima carga: </label>
          <select id="cenario" defaultValue={cenario} onChange={(evento) => { cenario = evento.target.value; }}>
            <option value="pronto">Com dados</option>
            <option value="carregando">Carga lenta (5 segundos)</option>
            <option value="erro">Erro</option>
            <option value="vazio">Lista vazia</option>
            <option value="erro-obsoleto">Falha obsoleta no StrictMode</option>
            <option value="vazio-obsoleto">Lista vazia obsoleta no StrictMode</option>
          </select>
        </div>
        <LocaisProvider carregar={carregarCenario}>
          <MainLayout><AppRoutes /></MainLayout>
        </LocaisProvider>
      </PreferenciasProvider>
    </MemoryRouter>
  </StrictMode>,
);
