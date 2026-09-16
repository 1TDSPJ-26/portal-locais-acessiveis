export default function Acessibilidade() {
  return (
    <article className="accessibility-page">
      <header>
        <p>Compromisso com a inclusão</p>
        <h1>Acessibilidade</h1>
        <p>
          Nosso objetivo é tornar o acesso às informações sobre locais e
          serviços acessíveis mais simples, claro e inclusivo para todas as
          pessoas.
        </p>
      </header>

      <section aria-labelledby="accessibility-resources">
        <h2 id="accessibility-resources">
          Recursos de acessibilidade
        </h2>

        <p>
          O portal busca oferecer uma experiência acessível e facilitar a
          navegação e o acesso às informações.
        </p>

        <ul>
          <li>
            Navegação por teclado nas principais áreas do portal.
          </li>
          <li>
            Estrutura de conteúdo organizada com títulos e seções.
          </li>
          <li>
            Textos e informações apresentados de forma clara e objetiva.
          </li>
          <li>
            Identificação visual dos elementos que recebem foco durante a
            navegação.
          </li>
        </ul>
      </section>

      <section aria-labelledby="accessibility-navigation">
        <h2 id="accessibility-navigation">
          Navegação por teclado
        </h2>

        <p>
          Os elementos interativos do portal podem ser acessados utilizando a
          tecla Tab. O foco visual indica o elemento que está selecionado
          durante a navegação.
        </p>
      </section>

      <section aria-labelledby="accessibility-standard">
        <h2 id="accessibility-standard">
          Conformidade e compromisso
        </h2>

        <p>
          O portal busca seguir boas práticas de acessibilidade digital e
          utiliza as diretrizes de acessibilidade como referência para a
          construção e evolução da plataforma.
        </p>
      </section>

      <section aria-labelledby="accessibility-limitations">
        <h2 id="accessibility-limitations">
          Limitações conhecidas
        </h2>

        <p>
          Apesar dos esforços para oferecer uma experiência acessível, alguns
          conteúdos ou funcionalidades podem apresentar limitações. Estamos
          trabalhando continuamente para identificar e melhorar esses pontos.
        </p>
      </section>

      <section aria-labelledby="accessibility-contact">
        <h2 id="accessibility-contact">
          Entre em contato
        </h2>

        <p>
          Caso encontre alguma dificuldade de acessibilidade ou tenha uma
          sugestão para melhorar o portal, entre em contato com a equipe
          responsável pelo projeto.
        </p>
      </section>
    </article>
  );
}