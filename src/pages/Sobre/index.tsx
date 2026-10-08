import type { ReactNode } from "react";
import {
  curso,
  integrantes,
  professorOrientador,
  tecnologias,
  turma,
  urlPerfilGithub,
  urlRepositorio,
} from "../../data/creditos";
import "./styles.css";

type InfoSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  highlighted?: boolean;
  wide?: boolean;
};

function InfoSection({
  id,
  title,
  children,
  highlighted = false,
  wide = false,
}: InfoSectionProps) {
  const classes = ["about-section"];
  if (highlighted) classes.push("about-section--notice");
  if (wide) classes.push("about-section--wide");

  return (
    <section className={classes.join(" ")} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="about-new-tab"> (abre em nova aba)</span>
    </a>
  );
}

export default function Sobre() {
  return (
    <article className="about-page">
      <title>Sobre | Portal de Locais e Serviços Acessíveis</title>

      <header className="about-hero">
        <p className="about-eyebrow">Conheça o projeto</p>
        <h1>Sobre o Portal</h1>
        <p>
          Informação acessível para ajudar todas as pessoas a encontrar locais e
          serviços que atendam às suas necessidades.
        </p>
      </header>

      <div className="about-grid">
        <InfoSection id="about-objective" title="Nosso objetivo">
          <p>
            Reunir informações claras sobre recursos de acessibilidade em locais e
            serviços, facilitando a pesquisa e apoiando escolhas mais conscientes.
          </p>
        </InfoSection>

        <InfoSection id="about-problem" title="O problema que enfrentamos">
          <p>
            Informações sobre acessibilidade ainda são dispersas, incompletas ou
            difíceis de encontrar. Isso cria barreiras antes mesmo de uma pessoa
            chegar ao local que pretende visitar.
          </p>
        </InfoSection>

        <InfoSection id="about-principles" title="Nossos princípios">
          <ul>
            <li>Respeito à autonomia e à diversidade das pessoas.</li>
            <li>Informações objetivas, compreensíveis e atualizadas.</li>
            <li>Colaboração responsável entre usuários e estabelecimentos.</li>
            <li>Melhoria contínua da experiência de acesso à informação.</li>
          </ul>
        </InfoSection>

<InfoSection id="about-purpose" title="Nosso propósito">
          <p>
            O portal existe para que pessoas com deficiência, pessoas com
            mobilidade reduzida, pessoas idosas e seus acompanhantes consigam
            saber, antes de sair de casa, se um local oferece os recursos de que
            precisam.
          </p>
          <p>
            Esse propósito se relaciona ao direito de acesso à informação. A{" "}
            <strong>Lei nº 13.146/2015</strong> (Lei Brasileira de Inclusão da
            Pessoa com Deficiência) assegura à pessoa com deficiência o
            exercício de seus direitos à acessibilidade, à informação e à
            comunicação em igualdade de condições com as demais pessoas. Reunir
            dados claros sobre acessibilidade é uma forma de contribuir para
            esse direito.
          </p>
        </InfoSection>

        <InfoSection id="about-sample-data" title="Locais de exemplo são fictícios">
          <p>
            Os seis locais que acompanham o portal, como a Biblioteca Parque e o
            Café Aurora, foram criados apenas para demonstrar o funcionamento do
            sistema. Nomes, endereços e recursos de acessibilidade{" "}
            <strong>não correspondem a estabelecimentos reais</strong> e não
            devem ser usados para planejar uma visita.
          </p>
        </InfoSection>

        <InfoSection id="about-credits" title="Créditos" wide>
          <div className="about-credits">
            <div>
              <h3>Projeto acadêmico</h3>
              <p>
                Desenvolvido pela {turma}, do curso de {curso}, como projeto
                continuado da disciplina.
              </p>
            </div>

            <div>
              <h3>Professor orientador</h3>
              <p>
                <ExternalLink href={urlPerfilGithub(professorOrientador.github)}>
                  {professorOrientador.nome}
                </ExternalLink>
              </p>
            </div>

            <div>
              <h3>Integrantes</h3>
              <ul>
                {integrantes.map((pessoa) => (
                  <li key={pessoa.github}>
                    <ExternalLink href={urlPerfilGithub(pessoa.github)}>
                      {pessoa.nome}
                    </ExternalLink>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Tecnologias utilizadas</h3>
              <ul>
                {tecnologias.map((tecnologia) => (
                  <li key={tecnologia}>{tecnologia}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Código-fonte</h3>
              <p>
                <ExternalLink href={urlRepositorio}>
                  Repositório do projeto no GitHub
                </ExternalLink>
              </p>
            </div>
          </div>
        </InfoSection>
        
        <InfoSection
          id="about-notice"
          title="Aviso de não certificação"
          highlighted
        >
          <p>
            <strong>Este portal não certifica oficialmente a acessibilidade.</strong>{" "}
            As informações apresentadas têm caráter informativo e podem mudar com o
            tempo. Antes de visitar um estabelecimento, confirme diretamente com o
            local se os recursos necessários estão disponíveis.
          </p>
        </InfoSection>
      </div>
    </article>
  );
}
