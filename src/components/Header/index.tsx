import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router";
import { usePreferencias } from "../../PreferenciasContext";

export function Header() {
  const { fonte, contraste, definirFonte, alternarContraste, restaurar } =
    usePreferencias();
  const location = useLocation();

  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  const painelMenuRef = useRef<HTMLElement>(null);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  const [rotaAnterior, setRotaAnterior] = useState(location.pathname);
  if (location.pathname !== rotaAnterior) {
    setRotaAnterior(location.pathname);
    setMenuAberto(false);
  }

  useEffect(() => {
    if (!menuAberto) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuAberto(false);
        botaoMenuRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && painelMenuRef.current) {
        const focaveis = painelMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focaveis.length === 0) return;

        const primeiro = focaveis[0];
        const ultimo = focaveis[focaveis.length - 1];

        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuAberto]);

  return (
    <header>
      <div className="header-top">
        <h1>Portal de Locais e Serviços Acessíveis</h1>

        <button
          ref={botaoMenuRef}
          type="button"
          className="menu-toggle"
          aria-expanded={menuAberto}
          aria-controls="menu-principal"
          aria-label="Menu de navegação"
          onClick={() => setMenuAberto((aberto) => !aberto)}
        >
          <svg
            className="menu-toggle-icon"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden="true"
            focusable="false"
          >
            {menuAberto ? (
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      <nav
        id="menu-principal"
        ref={painelMenuRef}
        aria-label="Navegação principal"
        className={menuAberto ? "nav-aberto" : undefined}
      >
        <NavLink to="/" end className={linkClass} onClick={() => setMenuAberto(false)}>
          Home
        </NavLink>

        <NavLink to="/locais" className={linkClass} onClick={() => setMenuAberto(false)}>
          Locais
        </NavLink>

        <NavLink to="/cadastrar" className={linkClass} onClick={() => setMenuAberto(false)}>
          Cadastro
        </NavLink>

        <NavLink to="/sobre" className={linkClass} onClick={() => setMenuAberto(false)}>
          Sobre
        </NavLink>

        <NavLink to="/acessibilidade" className={linkClass} onClick={() => setMenuAberto(false)}>
          Acessibilidade
        </NavLink>
      </nav>

      <fieldset className="controles-exibicao">
        <legend className="sr-only">Preferências de exibição</legend>

        <button
          type="button"
          aria-label="Diminuir fonte"
          disabled={fonte === "normal"}
          onClick={() =>
            definirFonte(fonte === "maior" ? "grande" : "normal")
          }
        >
          A−
        </button>

        <button
          type="button"
          aria-label="Fonte padrão"
          aria-pressed={fonte === "normal"}
          onClick={() => definirFonte("normal")}
        >
          A
        </button>

        <button
          type="button"
          aria-label="Aumentar fonte"
          disabled={fonte === "maior"}
          onClick={() =>
            definirFonte(fonte === "normal" ? "grande" : "maior")
          }
        >
          A+
        </button>

        <button
          type="button"
          aria-pressed={contraste === "alto"}
          onClick={alternarContraste}
        >
          Alto contraste
        </button>

        <button type="button" onClick={restaurar}>
          Restaurar padrão
        </button>
      </fieldset>
    </header>
  );
}