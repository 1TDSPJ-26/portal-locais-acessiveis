import { Link, useLocation, useParams, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import Mensagem from "../../components/Mensagem";
import { BotaoFavorito } from "../../components/BotaoFavorito";
import { DistanciaLocal } from "../../components/DistanciaLocal";
import { useLocais } from "../../useLocais";
import { buscarLocalPorId } from "../../utils/buscar-local-por-id";
import TrilhaNavegacao from "../../components/TrilhaNavegacao";
import {
  compartilharLink,
  type ResultadoCompartilhamento,
} from "../../utils/compartilhar-link";
import { obterOrigemListagem } from "../../utils/origem-listagem";

export default function DetalheLocal() { 
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const origemListagem = obterOrigemListagem(location.state);
  const niveisBase = [
    { rotulo: "Início", destino: "/" },
    { rotulo: "Locais", destino: origemListagem, state: { retornoDaListagem: true } },
  ];
  const { locais, estado, tentarNovamente, removerLocal } = useLocais();

  const excluirRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const campoLinkRef = useRef<HTMLInputElement>(null);

  const [resultadoCompartilhamento, setResultadoCompartilhamento] =
    useState<ResultadoCompartilhamento | null>(null);

  useEffect(() => {
    if (resultadoCompartilhamento === "falhou") {
      campoLinkRef.current?.focus();
      campoLinkRef.current?.select();
    }
  }, [resultadoCompartilhamento]);

  if (estado === "carregando") {
    return (
      <div className="app-shell content">
        <title>Carregando local | Portal de Locais e Serviços Acessíveis</title>

        <h1>Detalhes do local</h1>
        <output aria-live="polite">Carregando local...</output>
      </div>
    );
  }

  if (estado === "erro") {
    return (
      <div className="app-shell content">
        <title>Erro ao carregar local | Portal de Locais e Serviços Acessíveis</title>

        <h1>Não foi possível carregar o local</h1>
        <Mensagem tipo="erro">Tente novamente para consultar as informações do local.</Mensagem>
        <button
          className="botao botao--secundario"
          type="button"
          onClick={tentarNovamente}
        >
          Tentar novamente
        </button>
        <p><Link to={origemListagem} state={{ retornoDaListagem: true }}>Voltar para a listagem de locais</Link></p>
      </div>
    );
  }

  const local = buscarLocalPorId(locais, id);

    if (!local) {
    return (
      <div className="app-shell content">
        <title>Local não encontrado | Portal de Locais e Serviços Acessíveis</title>
        <TrilhaNavegacao
          niveis={[...niveisBase, { rotulo: "Local não encontrado" }]}
        />
        <h1>Local não encontrado</h1>
        <Mensagem tipo="aviso">Não existe um local com o identificador informado.</Mensagem>
        <Link to={origemListagem} state={{ retornoDaListagem: true }}>Voltar para a listagem de locais</Link>
      </div>
    );
  }

  const descricao = local.descricao?.trim();
  const email = local.email?.trim();
  const telefone = local.telefone?.trim();
  const site = local.site?.trim();
  const urlSite = site
    ? /^https?:\/\//i.test(site) ? site : `https://${site}`
    : undefined;

  const mensagemSucesso = (location.state as { mensagem?: string } | null)?.mensagem;

  const nomeLocal = local.nome;

  const urlCompartilhamento =
    `${window.location.origin}/locais/${local.id}`;

  async function handleCompartilharLocal() {
    const share = navigator.share;
    const clipboard = navigator.clipboard;

    const resultado = await compartilharLink(
    nomeLocal,
    urlCompartilhamento,
      {
        share:
          typeof share === "function"
            ? share.bind(navigator)
            : undefined,
        writeText:
          typeof clipboard?.writeText === "function"
            ? clipboard.writeText.bind(clipboard)
            : undefined,
      },
    );

    setResultadoCompartilhamento(resultado);
  }

  return (
    <article className="app-shell content">
      <title>{`${local.nome} | Portal de Locais e Serviços Acessíveis`}</title>
      <TrilhaNavegacao niveis={[...niveisBase, { rotulo: local.nome }]} />

      <Mensagem tipo="sucesso" className={mensagemSucesso ? "mb-4" : undefined}>
        {mensagemSucesso}
      </Mensagem>
      <header className="detalhe-identificacao">
  <span className="detalhe-categoria">{local.categoria}</span>
  <h1>{local.nome}</h1>
</header>

<div className="detalhe-layout">
  <div className="detalhe-principal">
    <dl className="detalhe-informacoes">
      <dt>Endereço</dt>
      <dd>{local.endereco}</dd>
    </dl>
    <DistanciaLocal local={local} />

    {descricao && (
      <section
        className="detalhe-descricao"
        aria-labelledby="titulo-descricao-local"
      >
        <h2 id="titulo-descricao-local">Descrição</h2>
        <p>{descricao}</p>
      </section>
    )}

    <section
      className="detalhe-recursos"
      aria-labelledby="titulo-recursos-local"
    >
      <h2 id="titulo-recursos-local">Recursos de acessibilidade</h2>

      <ul>
        {local.recursos.map((recurso) => (
          <li key={recurso}>{recurso}</li>
        ))}
      </ul>

      {local.recursos.length === 0 && (
        <p>Nenhum recurso de acessibilidade informado.</p>
      )}
    </section>
  </div>

  <div className="detalhe-lateral">
    <section
      className="detalhe-acoes"
      aria-labelledby="titulo-acoes-local"
    >
      <h2 id="titulo-acoes-local" className="sr-only">
        Ações do local
      </h2>

      <BotaoFavorito local={local} />

      <button
        type="button"
        className="botao botao--secundario"
        onClick={() => {
          void handleCompartilharLocal();
        }}
      >
        Compartilhar local
      </button>

      <Link
        to={`/locais/${local.id}/editar`}
        state={{ origemListagem }}
        className="botao botao--secundario"
      >
        Editar local
      </Link>
    </section>

    {resultadoCompartilhamento === "falhou" && (
      <div className="detalhe-compartilhamento-manual">
        <label htmlFor="link-compartilhamento">
          Copie o link do local:
        </label>

        <input
          ref={campoLinkRef}
          id="link-compartilhamento"
          className="campo"
          type="text"
          value={urlCompartilhamento}
          readOnly
          onFocus={(evento) => {
            evento.currentTarget.select();
          }}
        />
      </div>
    )}

    {(email || telefone || site) && (
      <section
        className="detalhe-contato"
        aria-labelledby="titulo-contato-local"
      >
        <h2 id="titulo-contato-local">Contato</h2>

        <dl className="detalhe-informacoes">
          {email && (
            <>
              <dt>E-mail</dt>
              <dd>
                <a href={`mailto:${email}`}>{email}</a>
              </dd>
            </>
          )}

          {telefone && (
            <>
              <dt>Telefone</dt>
              <dd>
                <a href={`tel:${telefone.replace(/[^\d+]/g, "")}`}>
                  {telefone}
                </a>
              </dd>
            </>
          )}

          {site && (
            <>
              <dt>Site</dt>
              <dd>
                <a
                  href={urlSite}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site} (abre em nova aba)
                </a>
              </dd>
            </>
          )}
        </dl>
      </section>
    )}

    <div className="detalhe-exclusao">
      <button
        ref={excluirRef}
        type="button"
        className="botao botao--perigo"
        onClick={() => {
          dialogRef.current?.showModal();
          cancelarRef.current?.focus();
        }}
      >
        Excluir local
      </button>
    </div>
  </div>
</div>

<Link
  className="detalhe-voltar"
  to={origemListagem}
  state={{ retornoDaListagem: true }}
>
  Voltar para a listagem de locais
</Link>

      <dialog
        ref={dialogRef}
        className="delete-dialog"
        aria-labelledby="titulo-exclusao"
        aria-describedby="descricao-exclusao"
        onClose={() => excluirRef.current?.focus()}
      >
        <h2 id="titulo-exclusao">Excluir local?</h2>
        <p id="descricao-exclusao">
          O local <strong>{local.nome}</strong> será excluído. Esta ação não pode
          ser desfeita.
        </p>
        <div className="local-actions">
          <button
            ref={cancelarRef}
            type="button"
            className="botao botao--secundario"
            onClick={() => dialogRef.current?.close()}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="botao botao--secundario"
            onClick={() => {
              dialogRef.current?.close();
              removerLocal(local.id);
              void navigate(origemListagem, { state: { localExcluido: local.nome } });
            }}
          >
            Excluir
          </button>
        </div>
      </dialog>
    </article>
  );
}
