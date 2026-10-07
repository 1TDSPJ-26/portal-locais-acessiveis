import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useLocais } from "../../useLocais";
import {
  categoriasLocais,
  recursosAcessibilidade,
  type CategoriaLocal,
  type FiltrosLocais,
  type RecursoAcessibilidade,
} from "../../types/local";
import { filtrarLocais } from "../../utils/filtrar-locais";
import { usePaginacao } from "../../hooks/usePaginacao";
import { Paginacao } from "../../components/Paginacao";



export default function LocaisPage() {
  const { locais, estado, tentarNovamente } = useLocais();
  const [searchParams, setSearchParams] = useSearchParams();

  const termo = searchParams.get("busca") ?? "";
  const categoriaParam = searchParams.get("categoria");
  
  const categoria: FiltrosLocais["categoria"] =
  categoriasLocais.includes(categoriaParam as CategoriaLocal)
    ? (categoriaParam as CategoriaLocal)
    : "";

  const recursos = searchParams
    .getAll("recurso")
    .filter((recurso): recurso is RecursoAcessibilidade =>
      recursosAcessibilidade.includes(recurso as RecursoAcessibilidade)
    );
  const filtros: FiltrosLocais = {
    categoria,
    recursos,
  };
  const [painelAberto, setPainelAberto] = useState(false);
  const [mensagemExclusao, setMensagemExclusao] = useState("");
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const nome = location.state?.localExcluido;
    if (typeof nome !== "string" || !nome) return;

    tituloRef.current?.focus();
    // A região viva nasce vazia e recebe o anúncio depois de montar a listagem.
    const timeout = window.setTimeout(() => {
      setMensagemExclusao(`Local ${nome} excluído com sucesso.`);
      // Consome o aviso para não repeti-lo ao voltar pelo histórico.
      void navigate("/locais", { replace: true, state: null });
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [location.state, navigate]);

  const resultados = filtrarLocais(locais, termo, filtros);
  const {
    visiveis,
    paginaAtual,
    pages,
    canPrev,
    canNext,
    intervaloLabel,
    porPagina,
    availableOptions,
    topoListaRef,
    handleMudarPagina,
    handleMudarPorPagina,
    handleFiltroAlterado,
  } = usePaginacao(resultados, [3, 6, 12], 3);

  // Toda alteração de busca ou filtro volta para a primeira página.
  const aoAlterarFiltros = (acao: () => void) => {
    acao();
    handleFiltroAlterado();
  };

  const temFiltrosAtivos =
    termo.trim() !== "" ||
    filtros.categoria !== "" ||
    filtros.recursos.length > 0;

  const alternarRecurso = (recurso: RecursoAcessibilidade) => {
    aoAlterarFiltros(() =>
      setFiltros((estadoAtual) => ({
        ...estadoAtual,
        recursos: estadoAtual.recursos.includes(recurso)
          ? estadoAtual.recursos.filter((item) => item !== recurso)
          : [...estadoAtual.recursos, recurso],
      }))
    );
  };

  const limparFiltros = () => {
    aoAlterarFiltros(() => {
      setTermo("");
      setFiltros(filtrosVazios);
    });
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">Mapa de acesso para todos</p>
        <h1 ref={tituloRef} tabIndex={-1}>Encontre lugares que acolhem você.</h1>
        <p className="hero-copy">
          Pesquise por nome ou combine recursos de acessibilidade para planejar
          sua próxima saída.
        </p>
        <label className="search-field" htmlFor="campo-busca-locais">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <span className="sr-only">Buscar por nome, bairro ou endereço</span>
          <input
            id="campo-busca-locais"
            type="search"
            value={termo}
            onChange={(evento) =>
              aoAlterarFiltros(() => setTermo(evento.target.value))
            }
            placeholder="Buscar por nome, bairro ou endereço"
          />
          <output aria-live="polite">
            {estado === "pronto" && (
              <>{resultados.length} {resultados.length === 1 ? "local encontrado" : "locais encontrados"}</>
            )}
          </output>
        </label>
      </header>

      <section className="content" aria-label="Locais acessíveis">
        <output className="delete-notice" aria-live="polite" aria-atomic="true">
          {mensagemExclusao}
        </output>
        <div className="results-heading">
          <div>
            <p className="section-kicker">Explorar locais</p>
            <h2 ref={topoListaRef} tabIndex={-1}>
              {estado === "pronto"
                ? `${resultados.length} ${resultados.length === 1 ? "resultado encontrado" : "resultados encontrados"}`
                : "Locais acessíveis"}
            </h2>
          </div>
          <button
            className="filter-toggle"
            type="button"
            aria-expanded={painelAberto}
            aria-controls="filtros-locais"
            disabled={estado !== "pronto" || locais.length === 0}
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

        <output
          aria-live="polite"
          className={estado === "carregando" ? "empty-state" : "sr-only"}
        >
          {estado === "carregando" ? "Carregando locais..." : ""}
        </output>

        <div role="alert" className={estado === "erro" ? "empty-state" : undefined}>
          {estado === "erro" && (
            <>
              <h2>Não foi possível carregar os locais</h2>
              <p>Tente novamente para consultar os locais disponíveis.</p>
              <button
                className="clear-button prominent"
                type="button"
                onClick={tentarNovamente}
              >
                Tentar novamente
              </button>
            </>
          )}
        </div>

        <aside
          id="filtros-locais"
          hidden={estado !== "pronto" || locais.length === 0}
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
                      aoAlterarFiltros(() =>
                        setFiltros((atual) => ({
                          ...atual,
                          categoria: evento.target.value as CategoriaLocal,
                        }))
                      )
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

        {estado === "pronto" && temFiltrosAtivos && (
          <div className="active-filters" aria-label="Filtros ativos">
            <span>Filtros ativos:</span>
            {termo.trim() && (
              <button
                type="button"
                onClick={() => aoAlterarFiltros(() => setTermo(""))}
              >
                Busca: “{termo}” ×
              </button>
            )}
            {filtros.categoria && (
              <button
                type="button"
                onClick={() =>
                  aoAlterarFiltros(() =>
                    setFiltros((atual) => ({ ...atual, categoria: "" }))
                  )
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

        {estado === "pronto" && (locais.length === 0 ? (
          <div className="empty-state">
            <h2>Nenhum local cadastrado</h2>
            <p>
              Cadastre o primeiro local e ajude outras pessoas a encontrar lugares acessíveis.
            </p>
            <Link className="clear-button prominent" to="/cadastrar">
              Cadastrar local
            </Link>
          </div>
        ) : resultados.length > 0 ? (
          <>
            <div className="places-grid">
              {visiveis.map((local) => (
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
            <Paginacao
              paginaAtual={paginaAtual}
              pages={pages}
              canPrev={canPrev}
              canNext={canNext}
              intervaloLabel={intervaloLabel}
              porPagina={porPagina}
              availableOptions={availableOptions}
              onMudarPagina={handleMudarPagina}
              onMudarPorPagina={handleMudarPorPagina}
            />
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" aria-hidden="true">
              ⌁
            </span>
            <h2>Nenhum local encontrado</h2>
            <p>
              {termo.trim()
                ? `Não foi possível encontrar locais para “${termo.trim()}”`
                : "Tente remover algum filtro ou buscar por outro termo."}
            </p>
            <button
              className="clear-button prominent"
              type="button"
              onClick={limparFiltros}
            >
              Limpar filtros
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}