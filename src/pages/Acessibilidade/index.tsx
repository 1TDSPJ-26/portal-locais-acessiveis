import "./styles.css";

export default function Acessibilidade() {
  return (
    <div className="accessibility-page">
      <header className="accessibility-header">
        <p className="accessibility-eyebrow">
          Compromisso com a inclusão
        </p>

        <h1>Acessibilidade</h1>

        <p>
          Nosso objetivo é tornar o acesso às informações sobre locais e
          serviços acessíveis mais simples, claro e inclusivo para todas as
          pessoas.
        </p>
      </header>

      <div className="accessibility-content">
        <section aria-labelledby="recursos">
          <h2 id="recursos">Recursos de acessibilidade</h2>

          <p>
            O portal utiliza uma estrutura organizada para facilitar o acesso
            às informações e a navegação entre as páginas.
          </p>

          <ul>
            <li>Conteúdo organizado por títulos e seções.</li>
            <li>Textos apresentados de forma clara e objetiva.</li>
            <li>Elementos de navegação identificados de forma clara.</li>
          </ul>
        </section>

        <section aria-labelledby="teclado">
          <h2 id="teclado">Navegação por teclado</h2>

          <p>
            A navegação pelo portal pode ser realizada utilizando o teclado.
            A tecla Tab permite percorrer os elementos interativos disponíveis
            na página.
          </p>
        </section>

        <section aria-labelledby="conformidade">
          <h2 id="conformidade">Nível de conformidade</h2>

          <p>
            O portal utiliza as diretrizes WCAG 2.2 como referência para suas
            práticas de acessibilidade.
          </p>

          <p>
            <strong>Nível de conformidade almejado: A.</strong>
          </p>
        </section>

        <section aria-labelledby="limitacoes">
          <h2 id="limitacoes">Limitações conhecidas</h2>

          <p>
            Algumas funcionalidades de acessibilidade ainda estão em processo
            de implementação e melhoria.
          </p>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato">Entre em contato</h2>

          <p>
            Caso encontre alguma barreira de acessibilidade ou tenha uma
            sugestão de melhoria, utilize o canal abaixo.
          </p>

          <p>
            <strong>Canal para relatar barreiras:</strong>{" "}
            <a
              href="https://github.com/1TDSPJ-26/portal-locais-acessiveis"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues do projeto
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}