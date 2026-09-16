import { NavLink } from "react-router";
import { usePreferencias } from "../../PreferenciasContext";

export function Header() {
  const { fonte, contraste, definirFonte, alternarContraste, restaurar } = usePreferencias();
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header>
      <h1>Portal de Locais e Serviços Acessíveis</h1>
<<<<<<< HEAD
      <nav aria-label="Navegação principal">
        <NavLink to="/" end className={linkClass}>Home</NavLink>
        <NavLink to="/locais" className={linkClass}>Locais</NavLink>
        <NavLink to="/cadastrar" className={linkClass}>Cadastro</NavLink>
        <NavLink to="/sobre" className={linkClass}>Sobre</NavLink>
=======
       <nav aria-label="Navegação principal">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/locais" className={linkClass}>
          Locais
        </NavLink>
        <NavLink to="/cadastrar" className={linkClass}>
          Cadastro
        </NavLink>
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
        <NavLink to="/acessibilidade" className={linkClass}>
          Acessibilidade
        </NavLink>
>>>>>>> e7df4cf (feat: Foi criado a página Acessibilidade, rota acessibilidade, link adicionado no header e footer e conteudo inicial da página foi colocado.)
      </nav>
      <fieldset className="controles-exibicao">
        <legend className="sr-only">Preferências de exibição</legend>
        <button type="button" aria-label="Diminuir fonte" disabled={fonte === "normal"} onClick={() => definirFonte(fonte === "maior" ? "grande" : "normal")}>A−</button>
        <button type="button" aria-label="Fonte padrão" aria-pressed={fonte === "normal"} onClick={() => definirFonte("normal")}>A</button>
        <button type="button" aria-label="Aumentar fonte" disabled={fonte === "maior"} onClick={() => definirFonte(fonte === "normal" ? "grande" : "maior")}>A+</button>
        <button type="button" aria-pressed={contraste === "alto"} onClick={alternarContraste}>Alto contraste</button>
        <button type="button" onClick={restaurar}>Restaurar padrão</button>
      </fieldset>
    </header>
  );
}