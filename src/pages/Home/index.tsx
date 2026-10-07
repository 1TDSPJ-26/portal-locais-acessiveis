import { Link } from "react-router";
import "./styles.css";

export default function Home() {
  return (
    <article className="home">
    
      <section className="home-hero" aria-labelledby="home-titulo">
        <p className="home-rotulo">Portal de Locais e Serviços Acessíveis</p>
        <h2 id="home-titulo">Encontre lugares acessíveis perto de você</h2>
        <p className="home-intro">
          Reunimos locais e serviços da cidade com informações de
          acessibilidade para você planejar o próprio trajeto: buscar o que
          precisa, filtrar pelos recursos que importa ter e contribuir com o
          cadastro do que ainda não está aqui.
        </p>
        <div className="home-acoes">
          <Link to="/locais" className="home-acao home-acao--principal">
            Buscar locais
          </Link>
          <Link to="/cadastrar" className="home-acao home-acao--secundaria">
            Cadastrar um local
          </Link>
        </div>
      </section>

      <section
        className="home-como-usar"
        aria-labelledby="home-como-usar-titulo"
      >
        <h2 id="home-como-usar-titulo">Como usar o portal</h2>
        <ol className="home-passos">
          <li>
            <strong>Busque</strong> locais pelo nome na página de listagem.
          </li>
          <li>
            <strong>Filtre</strong> os resultados por categoria e pelos
            recursos de acessibilidade que você precisa, como entrada sem
            degraus, piso tátil ou Libras.
          </li>
          <li>
            <strong>Contribua</strong> cadastrando um local que você conhece e
            que ainda não está no portal.
          </li>
        </ol>
      </section>

      <section
        className="home-saiba-mais"
        aria-labelledby="home-saiba-mais-titulo"
      >
        <h2 id="home-saiba-mais-titulo">Saiba mais</h2>
        <ul className="home-links">
          <li>
            <Link to="/sobre">Sobre o portal</Link>
            <span> o que é o projeto e como ele funciona.</span>
          </li>
          <li>
            <Link to="/acessibilidade">Declaração de acessibilidade</Link>
            <span> os recursos disponíveis e como reportar barreiras.</span>
          </li>
        </ul>
      </section>
    </article>
  );
}