import { NavLink } from "react-router-dom";

export function Header() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header>
      <h1>Portal de Locais e Serviços Acessíveis</h1>
       <nav aria-label="Navegação principal">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/locais" className={linkClass}>
          Locais
        </NavLink>
        <NavLink to="/cadastro" className={linkClass}>
          Cadastro
        </NavLink>
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
      </nav>
    </header>

  );
}