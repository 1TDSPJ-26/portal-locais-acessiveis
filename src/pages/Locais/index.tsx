import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { useLocais } from "../../useLocais";
import { useLocalizacao } from "../../useLocalizacao";
import { useFavoritos } from "../../useFavoritos";
import {
  categoriasLocais,
  recursosAcessibilidade,
  type CategoriaLocal,
  type FiltrosLocais,
  type RecursoAcessibilidade,
} from "../../types/local";
import { filtrarLocais } from "../../utils/filtrar-locais";
import { listarFiltrosAtivos, type FiltroAtivo } from "../../utils/filtros-ativos";
import { ordenarLocais, type CriterioOrdenacao } from "../../utils/ordenar-locais";
import { formatarDataAtualizacao } from "../../utils/formatar-data-atualizacao";
import { usePaginacao } from "../../hooks/usePaginacao";
import { Paginacao } from "../../components/Paginacao";
import { LocalCard } from "../../components/LocalCard";
import Mensagem from "../../components/Mensagem";
import MensagemConfirmacao from "../../components/MensagemConfirmacao";

export default function LocaisPage() {
  const { locais, estado, usandoReserva, atualizadoEm, tentarNovamente } = useLocais();
  const { estado: estadoLocalizacao, posicao, solicitar } = useLocalizacao();
  const { favoritos } = useFavoritos();
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

  const filtros: FiltrosLocais = {
    categoria,
    recursos,
    somenteFavoritos: searchParams.get("favoritos") === "1",
  };

  const criterioParam = searchParams.get("ordem");
  const criterio: CriterioOrdenacao = criterioParam === "categoria" ? "categoria" : "nome";
  const paginaParam = Number(searchParams.get("pagina"));
  const paginaSolicitada = Number.isInteger(paginaParam) && paginaParam > 0 ? paginaParam : 1;
  const [painelAberto, setPainelAberto] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const campoBuscaRef = useRef<HTMLInputElement>(null);
  const botoesFiltrosRef = useRef<(HTMLButtonElement | null)[]>([]);
  const focoFiltroPendenteRef = useRef<number | null>(null);
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
    if (!location.state || typeof location.state !== "object") {
      return;
    }

    const temConfirmacao = "confirmacao" in location.state;
    if (!temConfirmacao) {
      return;
    }

    tituloRef.current?.focus();
  }, [location.state]);

  const resultados = ordenarLocais(
    filtrarLocais(locais, termo, filtros, favoritos),
    criterio,
    estadoLocalizacao === "obtida" && posicao ? posicao : undefined,
  );

  const atualizarPagina = (novaPagina: number) => {
    setSearchParams((atuais) => {
      const proximos = new URLSearchParams(atuais);
      if (novaPagina <= 1) proximos.delete("pagina");
      else proximos.set("pagina", String(novaPagina));
      return proximos;
    });
  };

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
  } = usePaginacao(resultados, [3, 6, 12], 3, paginaSolicitada, atualizarPagina);

  useEffect(() => {
    if (paginaSolicitada === paginaAtual) return;
    setSearchParams((atuais) => {
      const proximos = new URLSearchParams(atuais);
      if (paginaAtual === 1) proximos.delete("pagina");
      else proximos.set("pagina", String(paginaAtual));
      return proximos;
    }, { replace: true });
  }, [paginaAtual, paginaSolicitada, setSearchParams]);

  useEffect(() => {
    const estadoRetorno = location.state as { retornoDaListagem?: unknown } | null;
    if (!estadoRetorno?.retornoDaListagem) return;
    topoListaRef.current?.focus();
    void navigate({ pathname: "/locais", search: location.search }, { replace: true, state: null });
  }, [location.state, location.search, navigate, topoListaRef]);

  // Toda alteração de busca ou filtro grava na URL e volta para a primeira página.
  const atualizarParametros = (alterar: (params: URLSearchParams) => void) => {
    setSearchParams(
      (atuais) => {
        const proximos = new URLSearchParams(atuais);
        alterar(proximos);
        proximos.delete("pagina");
        return proximos;
      },
      { replace: true }
    );
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

  const alterarSomenteFavoritos = (ativo: boolean) => {
    atualizarParametros((params) => {
      if (ativo) params.set("favoritos", "1");
      else params.delete("favoritos");
    });
  };

  const limparFiltros = () => {
    atualizarParametros((params) => {
      params.delete("busca");
      params.delete("categoria");
      params.delete("recurso");
      params.delete("favoritos");
      params.delete("ordem");
    });
  };

  const filtrosAtivos = listarFiltrosAtivos(searchParams);

  const removerFiltro = (filtro: FiltroAtivo, indice: number) => {
    focoFiltroPendenteRef.current = indice;
    if (filtro.tipo === "busca") setTextoBusca("");

    atualizarParametros((params) => {
      if (filtro.tipo === "busca") params.delete("busca");
      if (filtro.tipo === "categoria") params.delete("categoria");
      if (filtro.tipo === "favoritos") params.delete("favoritos");
      if (filtro.tipo === "recurso") {
        const recursosRestantes = params
          .getAll("recurso")
          .filter((recurso) => recurso !== filtro.valor);
        params.delete("recurso");
        recursosRestantes.forEach((recurso) => params.append("recurso", recurso));
      }
    });
  };

  useEffect(() => {
    const indice = focoFiltroPendenteRef.current;
    if (indice === null) return;

    focoFiltroPendenteRef.current = null;
    botoesFiltrosRef.current[indice]?.focus();
    if (!botoesFiltrosRef.current[indice]) topoListaRef.current?.focus();
  }, [filtrosAtivos, topoListaRef]);

  const temFiltrosAtivos =
    termo.trim() !== "" ||
    filtros.categoria !== "" ||
    filtros.recursos.length > 0 ||
    filtros.somenteFavoritos ||
    criterio !== "nome";

  const totalFiltros = filtros.recursos.length + (filtros.categoria ? 1 : 0) + (filtros.somenteFavoritos ? 1 : 0);

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
              <p className="data-atualizacao">
                {atualizadoEm ? (
                  <>
                    Lista atualizada em{" "}
                    <time dateTime={atualizadoEm.toISOString()}>
                      {formatarDataAtualizacao(atualizadoEm)}
                    </time>
                  </>
                ) : (
                  "Lista com os dados de exemplo do portal"
                )}
              </p>
            )}
          </output>
        </label>
      </header>

      <section className="content" aria-label="Locais acessíveis">
        <MensagemConfirmacao />
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
            className="botao botao--secundario"
            type="button"
            onClick={solicitar}
            disabled={estadoLocalizacao === "buscando"}
          >
            {estadoLocalizacao === "buscando"
              ? "Obtendo localização..."
              : "Usar minha localização"}
          </button>

          {estadoLocalizacao === "erro" && (
            <Mensagem tipo="erro" className="empty-state">
              <p>Não foi possível obter sua localização. Tente novamente.</p>
            </Mensagem>
          )}

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
              onChange={(evento) => {
                const proximoCriterio = evento.target.value as CriterioOrdenacao;
                setSearchParams((atuais) => {
                  const proximos = new URLSearchParams(atuais);
                  if (proximoCriterio === "nome") proximos.delete("ordem");
                  else proximos.set("ordem", proximoCriterio);
                  return proximos;
                });
              }}
            >
              <option value="nome">Nome</option>
              <option value="categoria">Categoria</option>
              {estadoLocalizacao === "obtida" && (
                <option value="proximidade">Mais próximos</option>
              )}
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
            <legend>Favoritos</legend>
            <label className="check-option">
              <input
                type="checkbox"
                checked={filtros.somenteFavoritos}
                onChange={(evento) => alterarSomenteFavoritos(evento.target.checked)}
              />
              <span className="custom-check" aria-hidden="true">
                ✓
              </span>
              <span>Somente favoritos</span>
            </label>
          </fieldset>

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

        {estado === "pronto" && filtrosAtivos.length > 0 && (
          <div className="active-filters" aria-label="Filtros ativos">
            <span>Filtros ativos:</span>
            {filtrosAtivos.map((filtro, indice) => (
              <button
                className="botao botao--secundario"
                type="button"
                key={`${filtro.tipo}-${filtro.valor}-${indice}`}
                ref={(botao) => {
                  botoesFiltrosRef.current[indice] = botao;
                }}
                onClick={() => removerFiltro(filtro, indice)}
                aria-label={`Remover filtro: ${filtro.rotulo}`}
              >
                {filtro.rotulo} <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}

        {estado === "pronto" &&
          (locais.length === 0 ? (
            <div className="empty-state">
              <h2>Nenhum local cadastrado</h2>
              <p>
                {filtros.somenteFavoritos && favoritos.length === 0
                  ? "Você ainda não favoritou nenhum local. Cadastre o primeiro local para poder favoritá-lo."
                  : "Cadastre o primeiro local e ajude outras pessoas a encontrar lugares acessíveis."}
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
                {filtros.somenteFavoritos && favoritos.length === 0
                  ? "Você ainda não favoritou nenhum local. Favorite locais para encontrá-los com este filtro."
                  : termo.trim()
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
