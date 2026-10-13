// Entrada exclusiva de teste no Vite dev; não integra o build do portal.
import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { LocaisProvider } from "../../src/LocaisProvider";
import { FavoritosProvider } from "../../src/FavoritosProvider";
import { CHAVE_FAVORITOS } from "../../src/favoritos";
import { useLocais } from "../../src/useLocais";
import { useFavoritos } from "../../src/useFavoritos";
import type { Local } from "../../src/types/local";
import "../../src/index.css";

const parametros = new URLSearchParams(window.location.search);
const cenario = parametros.get("cenario") ?? "pronto";
const locaisTeste: Local[] = [1, 2, 42].map((id) => ({
  id,
  nome: `Local de teste ${id}`,
  categoria: "Cultura",
  endereco: `Rua de teste, ${id}`,
  recursos: [],
}));
let proximaLista = cenario === "vazio" ? [] : locaisTeste;
let falharCarga = cenario === "reserva";
let atraso = cenario === "lento" ? 5000 : 500;

// A semente sai da URL para que recarregar comprove a persistência real.
if (parametros.has("salvo")) {
  localStorage.setItem(CHAVE_FAVORITOS, parametros.get("salvo")!);
  parametros.delete("salvo");
  history.replaceState(null, "", `${location.pathname}?${parametros}`);
}
if (cenario === "bloqueado") {
  Object.defineProperty(window, "localStorage", {
    configurable: true,
    get() { throw new Error("Armazenamento bloqueado para teste"); },
  });
} else if (cenario === "sem-espaco") {
  Storage.prototype.setItem = () => { throw new Error("QuotaExceededError"); };
}

async function carregarCenario() {
  const lista = proximaLista;
  const falha = falharCarga;
  await new Promise<void>((resolve) => setTimeout(resolve, atraso));
  if (falha) throw new Error("Falha de carga simulada para teste");
  return lista.map((local) => ({ ...local, recursos: [...local.recursos] }));
}

function lerArmazenamento() {
  try {
    return localStorage.getItem(CHAVE_FAVORITOS) ?? "ausente";
  } catch {
    return "indisponível";
  }
}

export function PainelFavoritos() {
  const { favoritos, totalFavoritos, ehFavorito, alternarFavorito } = useFavoritos();
  const { estado, usandoReserva, locais, removerLocal, tentarNovamente } = useLocais();
  const [salvo, setSalvo] = useState(lerArmazenamento);

  function repetirCarga(lista: Local[], falha = false) {
    proximaLista = lista;
    falharCarga = falha;
    atraso = 500;
    tentarNovamente();
  }

  return (
    <main className="app-shell content">
      <h1>Teste da base de favoritos — Issue #135</h1>
      <p>Controles exclusivos de teste. Os botões do portal serão feitos na Issue #136.</p>
      <dl>
        <dt>Estado dos locais</dt><dd><output data-testid="estado">{estado}</output></dd>
        <dt>Usando dados de reserva</dt><dd><output data-testid="reserva">{String(usandoReserva)}</output></dd>
        <dt>IDs dos locais</dt><dd><output data-testid="locais">{JSON.stringify(locais.map((local) => local.id))}</output></dd>
        <dt>Favoritos</dt><dd><output data-testid="favoritos">{JSON.stringify(favoritos)}</output></dd>
        <dt>Total de favoritos</dt><dd><output data-testid="total">{totalFavoritos}</output></dd>
        <dt>Local 42 é favorito</dt><dd><output data-testid="favorito-42">{String(ehFavorito(42))}</output></dd>
      </dl>
      <div className="local-actions">
        {[1, 2, 42].map((id) => (
          <button key={id} type="button" className="botao botao--secundario"
            aria-pressed={ehFavorito(id)} onClick={() => alternarFavorito(id)}>
            Alternar favorito {id}
          </button>
        ))}
        <button type="button" className="botao botao--secundario"
          onClick={() => { alternarFavorito(1); alternarFavorito(2); }}>
          Alternar 1 e 2 juntos
        </button>
        <button type="button" className="botao botao--secundario"
          onClick={() => { alternarFavorito(1); alternarFavorito(1); }}>
          Alternar 1 duas vezes
        </button>
        <button type="button" className="botao botao--secundario"
          onClick={() => removerLocal(1)} disabled={estado !== "pronto"}>
          Excluir local 1
        </button>
      </div>
      <div className="local-actions">
        <button type="button" className="botao botao--secundario"
          onClick={() => repetirCarga(locaisTeste)}>Carregar lista completa</button>
        <button type="button" className="botao botao--secundario"
          onClick={() => repetirCarga(locaisTeste.filter((local) => local.id !== 42))}>
          Carregar lista sem 42
        </button>
        <button type="button" className="botao botao--secundario"
          onClick={() => repetirCarga([])}>Carregar lista vazia</button>
        <button type="button" className="botao botao--secundario"
          onClick={() => repetirCarga([], true)}>Simular falha de carga</button>
      </div>
      <section aria-label="Inspeção do armazenamento">
        <h2>Armazenamento do navegador</h2>
        <p>Chave: <code>{CHAVE_FAVORITOS}</code></p>
        <button type="button" className="botao botao--secundario"
          onClick={() => setSalvo(lerArmazenamento())}>Conferir armazenamento</button>
        <pre><output data-testid="armazenamento">{salvo}</output></pre>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaisProvider carregar={carregarCenario}>
      <FavoritosProvider><PainelFavoritos /></FavoritosProvider>
    </LocaisProvider>
  </StrictMode>,
);
