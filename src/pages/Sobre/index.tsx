import type { ReactNode } from "react";
import "./styles.css";

type InfoSectionProps = {
  id: string;
  title: string;
  children: ReactNode;
  highlighted?: boolean;
};

function InfoSection({
  id,
  title,
  children,
  highlighted = false,
}: InfoSectionProps) {
  return (
    <section
      className={highlighted ? "about-section about-section--notice" : "about-section"}
      aria-labelledby={id}
    >
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}

export default function Sobre() {
  return (
    <article className="about-page">
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
