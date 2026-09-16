import { useState } from "react";
import { locais } from "./data/locais";
import {
  categoriasLocais,
  recursosAcessibilidade,
  type CategoriaLocal,
  type FiltrosLocais,
  type RecursoAcessibilidade,
} from "./types/local";
import { filtrarLocais } from "./utils/filtrar-locais";

const filtrosVazios: FiltrosLocais = { categoria: "", recursos: [] };

export default function App() {
  const [termo, setTermo] = useState("");
  const [filtros, setFiltros] = useState<FiltrosLocais>(filtrosVazios);
  const [painelAberto, setPainelAberto] = useState(false);

  const resultados = filtrarLocais(locais, termo, filtros);
  const temFiltrosAtivos =
    termo.trim() !== "" ||
    filtros.categoria !== "" ||
    filtros.recursos.length > 0;

  const alternarRecurso = (recurso: RecursoAcessibilidade) => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      recursos: estadoAtual.recursos.includes(recurso)
        ? estadoAtual.recursos.filter((item) => item !== recurso)
        : [...estadoAtual.recursos, recurso],
    }));
  };

  const limparFiltros = () => {
    setTermo("");
    setFiltros(filtrosVazios);
  };

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Mapa de acesso para todos</p>
        <h1>Encontre lugares que acolhem você.</h1>
        <p className="hero-copy">
          Pesquise por nome ou combine recursos de acessibilidade para planejar
          sua próxima saída.
        </p>
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <span className="sr-only">Buscar por nome, bairro ou endereço</span>
          <input
            type="search"
            value={termo}
            onChange={(evento) => setTermo(evento.target.value)}
            placeholder="Buscar por nome, bairro ou endereço"
          />
        </label>
      </header>

      <section className="content" aria-label="Locais acessíveis">
        <div className="results-heading">
          <div>
            <p className="section-kicker">Explorar locais</p>
            <h2>
              {resultados.length}{" "}
              {resultados.length === 1
                ? "resultado encontrado"
                : "resultados encontrados"}
            </h2>
          </div>
          <button
            className="filter-toggle"
            type="button"
            aria-expanded={painelAberto}
            aria-controls="filtros-locais"
            onClick={() => setPainelAberto((aberto) => !aberto)}
          >
            <span aria-hidden="true">☷</span> Filtros
            {filtros.recursos.length + (filtros.categoria ? 1 : 0) > 0 && (
              <span className="filter-count">
                {filtros.recursos.length + (filtros.categoria ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        <aside
          id="filtros-locais"
          className={`filters-panel ${painelAberto ? "is-open" : ""}`}
        >
          <div className="filters-topline">
            <div>
              <p className="section-kicker">Refine sua busca</p>
              <h2>O que você precisa?</h2>
            </div>
            <button
              className="clear-button"
              type="button"
              onClick={limparFiltros}
              disabled={!temFiltrosAtivos}
            >
              Limpar filtros
            </button>
          </div>

          <fieldset>
            <legend>Categoria</legend>
            <div className="category-options">
              {categoriasLocais.map((categoria) => (
                <label
                  className={`category-option ${filtros.categoria === categoria ? "is-selected" : ""}`}
                  key={categoria}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={categoria}
                    checked={filtros.categoria === categoria}
                    onChange={(evento) =>
                      setFiltros((atual) => ({
                        ...atual,
                        categoria: evento.target.value as CategoriaLocal,
                      }))
                    }
                  />
                  <span>{categoria}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              Recursos de acessibilidade{" "}
              <span>(selecione todos que precisa)</span>
            </legend>
            <div className="resource-options">
              {recursosAcessibilidade.map((recurso) => (
                <label className="check-option" key={recurso}>
                  <input
                    type="checkbox"
                    checked={filtros.recursos.includes(recurso)}
                    onChange={() => alternarRecurso(recurso)}
                  />
                  <span className="custom-check" aria-hidden="true">
                    ✓
                  </span>
                  <span>{recurso}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </aside>

        {temFiltrosAtivos && (
          <div className="active-filters" aria-label="Filtros ativos">
            <span>Filtros ativos:</span>
            {termo.trim() && (
              <button type="button" onClick={() => setTermo("")}>
                Busca: “{termo}” ×
              </button>
            )}
            {filtros.categoria && (
              <button
                type="button"
                onClick={() =>
                  setFiltros((atual) => ({ ...atual, categoria: "" }))
                }
              >
                {filtros.categoria} ×
              </button>
            )}
            {filtros.recursos.map((recurso) => (
              <button
                type="button"
                key={recurso}
                onClick={() => alternarRecurso(recurso)}
              >
                {recurso} ×
              </button>
            ))}
          </div>
        )}

        {resultados.length > 0 ? (
          <div className="places-grid">
            {resultados.map((local) => (
              <article className="place-card" key={local.id}>
                <div className="place-card-top">
                  <span className="place-category">{local.categoria}</span>
                  <span className="place-status">Aberto hoje</span>
                </div>
                <h3>{local.nome}</h3>
                <p className="place-address">{local.endereco}</p>
                <div
                  className="resource-tags"
                  aria-label="Recursos disponíveis"
                >
                  {local.recursos.map((recurso) => (
                    <span key={recurso}>{recurso}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              ⌁
            </span>
            <h2>Nenhum local encontrado</h2>
            <p>Tente remover algum filtro ou buscar por outro termo.</p>
            <button
              className="clear-button prominent"
              type="button"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
