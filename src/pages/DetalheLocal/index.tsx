import { Link, useParams } from "react-router";
import { useLocais } from "../../useLocais";
import { buscarLocalPorId } from "../../utils/buscar-local-por-id";

export default function DetalheLocal() {
  const { id } = useParams<{ id: string }>();
  const { locais, estado, tentarNovamente } = useLocais();

  if (estado === "carregando") {
    return (
      <div className="app-shell content">
        <h1>Detalhes do local</h1>
        <output aria-live="polite">Carregando local...</output>
      </div>
    );
  }

  if (estado === "erro") {
    return (
      <div className="app-shell content">
        <h1>Não foi possível carregar o local</h1>
        <p role="alert">Tente novamente para consultar as informações do local.</p>
        <button
          className="clear-button prominent"
          type="button"
          onClick={tentarNovamente}
        >
          Tentar novamente
        </button>
        <p><Link to="/locais">Voltar para a listagem de locais</Link></p>
      </div>
    );
  }

  const local = buscarLocalPorId(locais, id);

  if (!local) {
    return (
      <div className="app-shell content">
        <h1>Local não encontrado</h1>
        <p>Não existe um local com o identificador informado.</p>
        <Link to="/locais">Voltar para a listagem de locais</Link>
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

  return (
    <article className="app-shell content">
      <h1>{local.nome}</h1>
      <dl>
        <dt>Categoria</dt>
        <dd>{local.categoria}</dd>
        <dt>Endereço</dt>
        <dd>{local.endereco}</dd>
      </dl>

      {descricao && (
        <section aria-labelledby="titulo-descricao-local">
          <h2 id="titulo-descricao-local">Descrição</h2>
          <p>{descricao}</p>
        </section>
      )}

      <section aria-labelledby="titulo-recursos-local">
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

      {(email || telefone || site) && (
        <section aria-labelledby="titulo-contato-local">
          <h2 id="titulo-contato-local">Contato</h2>
          <dl>
            {email && (
              <>
                <dt>E-mail</dt>
                <dd><a href={`mailto:${email}`}>{email}</a></dd>
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
                  <a href={urlSite} target="_blank" rel="noopener noreferrer">
                    {site} (abre em nova aba)
                  </a>
                </dd>
              </>
            )}
          </dl>
        </section>
      )}

      <Link to="/locais">Voltar para a listagem de locais</Link>
    </article>
  );
}
