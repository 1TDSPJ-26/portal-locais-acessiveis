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
import { ordenarLocais, type CriterioOrdenacao } from "../../utils/ordenar-locais";
import { usePaginacao } from "../../hooks/usePaginacao";
import { Paginacao } from "../../components/Paginacao";
import { LocalCard } from "../../components/LocalCard";

export default function LocaisPage() {
  const { locais, estado, usandoReserva, tentarNovamente } = useLocais();
  const [searchParams, setSearchParams] = useSearchParams();

  // Busca e filtros vivem na URL, então podem ser compartilhados e recarregados.
  const termo = searchParams.get("busca") ?? "";
  const categoriaParam = searchParams.get("categoria");

  const categoria: FiltrosLocais["categoria"] = categoriasLocais.includes(
    categoriaParam as CategoriaLocal
  )
    ? (categoriaParam as CategoriaLocal)
    : "";

  const recursos = searchParams
    .getAll("recurso")
    .filter((recurso): recurso is RecursoAcessibilidade =>
      recursosAcessibilidade.includes(recurso as RecursoAcessibilidade)
    );

  const filtros: FiltrosLocais = { categoria, recursos };

  const [criterio, setCriterio] = useState<CriterioOrdenacao>("nome");
  const [painelAberto, setPainelAberto] = useState(false);
  const [mensagemExclusao, setMensagemExclusao] = useState("");
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const campoBuscaRef = useRef<HTMLInputElement>(null);
  const [textoBusca, setTextoBusca] = useState(termo);
  const location = useLocation();
  const navigate = useNavigate();

  // A URL é atualizada em transição e chega depois da tecla. Enquanto o campo
  // está em foco, vale o que foi digitado; fora dele, a URL manda (limpar
  // filtros, remover o chip da busca, voltar no histórico).
  useEffect(() => {
    if (document.activeElement !== campoBuscaRef.current) {
      setTextoBusca(termo);
    }
  }, [termo]);

  useEffect(() => {
    const nome = location.state?.localExcluido;
    if (typeof nome !== "string" || !nome) return;

    tituloRef.current?.focus();
    // A região viva nasce vazia e recebe o anúncio depois de montar a listagem.
    const timeout = window.setTimeout(() => {
      setMensagemExclusao(`Local ${nome} excluído com sucesso.`);
      // Consome o aviso para não repeti-lo ao voltar pelo histórico,
      // mantendo os filtros que estavam na URL.
      void navigate(
        { pathname: "/locais", search: location.search },
        { replace: true, state: null }
      );
    }, 100);

    return () => window.clearTimeout(timeout);
  }, [location.state, location.search, navigate]);

  const resultados = ordenarLocais(filtrarLocais(locais, termo, filtros), criterio);

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

  // Toda alteração de busca ou filtro grava na URL e volta para a primeira página.
  const atualizarParametros = (alterar: (params: URLSearchParams) => void) => {
    setSearchParams(
      (atuais) => {
        const proximos = new URLSearchParams(atuais);
        alterar(proximos);
        return proximos;
      },
      { replace: true }
    );
    handleFiltroAlterado();
  };

  const alterarTermo = (valor: string) => {
    atualizarParametros((params) => {
      if (valor) params.set("busca", valor);
      else params.delete("busca");
    });
  };

  const alterarCategoria = (valor: FiltrosLocais["categoria"]) => {
    atualizarParametros((params) => {
      if (valor) params.set("categoria", valor);
      else params.delete("categoria");
    });
  };

  const alternarRecurso = (recurso: RecursoAcessibilidade) => {
    atualizarParametros((params) => {
      const atuais = params.getAll("recurso");
      params.delete("recurso");
      const proximos = atuais.includes(recurso)
        ? atuais.filter((item) => item !== recurso)
        : [...atuais, recurso];
      proximos.forEach((item) => params.append("recurso", item));
    });
  };

  const limparFiltros = () => {
    atualizarParametros((params) => {
      params.delete("busca");
      params.delete("categoria");
      params.delete("recurso");
    });
  };

  const temFiltrosAtivos =
    termo.trim() !== "" ||
    filtros.categoria !== "" ||
    filtros.recursos.length > 0;

  const totalFiltros = filtros.recursos.length + (filtros.categoria ? 1 : 0);

  return (
    <div className="app-shell">
      <title>Locais | Portal de Locais e Serviços Acessíveis</title>

      <header className="hero">
        <p className="eyebrow">Mapa de acesso para todos</p>
        <h1 ref={tituloRef} tabIndex={-1}>
          Encontre lugares que acolhem você.
        </h1>
        <p className="hero-copy">
          Pesquise por nome ou combine recursos de acessibilidade para planejar
          sua próxima saída.
        </p>
        <label className="search-field campo" htmlFor="campo-busca-locais">
          <span className="search-icon" aria-hidden="true">
            ⌕
          </span>
          <span className="sr-only">Buscar por nome, bairro ou endereço</span>
          <input
            id="campo-busca-locais"
            type="search"
            ref={campoBuscaRef}
            value={textoBusca}
            onChange={(evento) => {
              setTextoBusca(evento.target.value);
              alterarTermo(evento.target.value);
            }}
            placeholder="Buscar por nome, bairro ou endereço"
          />
          <output aria-live="polite">
            {estado === "pronto" && (
              <>
                {resultados.length}{" "}
                {resultados.length === 1
                  ? "local encontrado"
                  : "locais encontrados"}
              </>
            )}
          </output>
        </label>
      </header>

      <section className="content" aria-label="Locais acessíveis">
        <Mensagem tipo="sucesso" className="delete-notice">
          {mensagemExclusao}
        </Mensagem>
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
            className="botao botao--secundario filter-toggle"
            type="button"
            aria-expanded={painelAberto}
            aria-controls="filtros-locais"
            disabled={estado !== "pronto" || locais.length === 0}
            onClick={() => setPainelAberto((aberto) => !aberto)}
          >
            <span aria-hidden="true">☷</span> Filtros
            {totalFiltros > 0 && (
              <span className="filter-count">{totalFiltros}</span>
            )}
          </button>
        </div>

        {estado === "pronto" && locais.length > 0 && (
          <div className="sort-field">
            <label htmlFor="ordenar-locais">Ordenar por</label>
            <select
              id="ordenar-locais"
              value={criterio}
              onChange={(evento) => setCriterio(evento.target.value as CriterioOrdenacao)}
            >
              <option value="nome">Nome</option>
              <option value="categoria">Categoria</option>
            </select>
          </div>
        )}

        <output
          aria-live="polite"
          className={estado === "carregando" ? "empty-state" : "sr-only"}
        >
          {estado === "carregando" ? "Carregando locais..." : ""}
        </output>

        <Mensagem
          tipo="aviso"
          className={estado === "pronto" && usandoReserva ? "empty-state" : undefined}
        >
          {estado === "pronto" && usandoReserva && (
            <>
              <h2>Exibindo dados de reserva</h2>
              <p>
                Não foi possível carregar os locais salvos. A lista exibida
                contém os dados de reserva do projeto, e não a lista salva.
              </p>
              <button className="botao botao--secundario" type="button" onClick={tentarNovamente}>
                Tentar novamente
              </button>
            </>
          )}
        </Mensagem>

        <Mensagem tipo="erro" className={estado === "erro" ? "empty-state" : undefined}>
          {estado === "erro" && (
            <>
              <h2>Não foi possível carregar os locais</h2>
              <p>Tente novamente para consultar os locais disponíveis.</p>
              <button
                className="botao botao--secundario"
                type="button"
                onClick={tentarNovamente}
              >
                Tentar novamente
              </button>
            </>
          )}
        </Mensagem>

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
              className="botao botao--secundario"
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
              {categoriasLocais.map((opcao) => (
                <label
                  className={`category-option ${filtros.categoria === opcao ? "is-selected" : ""}`}
                  key={opcao}
                >
                  <input
                    type="radio"
                    name="categoria"
                    value={opcao}
                    checked={filtros.categoria === opcao}
                    onChange={(evento) =>
                      alterarCategoria(evento.target.value as CategoriaLocal)
                    }
                  />
                  <span>{opcao}</span>
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
              <button className="botao botao--secundario" type="button" onClick={() => {
                const parametros = new URLSearchParams(searchParams);
                parametros.delete("busca");
                setSearchParams(parametros);
              }}>

                Busca: “{termo}” ×
              </button>
            )}
            {filtros.categoria && (

              <button
                className="botao botao--secundario"
                type="button"
                onClick={() => {
                  const parametros = new URLSearchParams(searchParams);
                  parametros.delete("categoria");
                  setSearchParams(parametros);
                }}  
              >

                {filtros.categoria} ×
              </button>
            )}
            {filtros.recursos.map((recurso) => (
              <button
                className="botao botao--secundario"
                type="button"
                key={recurso}
                onClick={() => alternarRecurso(recurso)}
              >
                {recurso} ×
              </button>
            ))}
          </div>
        )}

        {estado === "pronto" &&
          (locais.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhum local cadastrado</h2>
              <p>
                Cadastre o primeiro local e ajude outras pessoas a encontrar
                lugares acessíveis.
              </p>
              <Link className="clear-button prominent" to="/cadastrar">
                Cadastrar local
              </Link>
            </div>
          ) : resultados.length > 0 ? (
            <>
              <div className="places-grid">
                {visiveis.map((local) => (
                  <LocalCard key={local.id} local={local} />
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