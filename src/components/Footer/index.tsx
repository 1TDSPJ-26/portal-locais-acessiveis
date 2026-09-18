import { Link } from "react-router";

export default function Footer() {
  return (
    <footer>
      <nav aria-label="Navegação do rodapé">
        <Link to="/">Página inicial</Link>
        <Link to="/locais">Locais acessíveis</Link>
        <Link to="/cadastrar">Cadastro</Link>
        <Link to="/sobre">Sobre o projeto</Link>
      </nav>

      <p>&copy; 2026 Portas Acessíveis. Todos os direitos reservados.</p>

      <a href="/acessibilidade">
        Acessibilidade
      </a>
    </footer>
  );
}