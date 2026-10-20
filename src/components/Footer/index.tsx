import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="app-shell rodape-conteudo">
        <nav className="rodape-links" aria-label="Navegação do rodapé">
          <Link to="/">Página inicial</Link>
          <Link to="/locais">Locais acessíveis</Link>
          <Link to="/cadastrar">Cadastro</Link>
          <Link to="/sobre">Sobre o projeto</Link>
          <Link to="/acessibilidade">Acessibilidade</Link>
        </nav>

        <p className="rodape-direitos">
          &copy; 2026 Portal de Locais e Serviços Acessíveis. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}