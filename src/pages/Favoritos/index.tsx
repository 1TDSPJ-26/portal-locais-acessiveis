import { Link } from "react-router";

export default function FavoritosVazio() {
  return (
    <output className="empty-state block" aria-live="polite">
      <h2>Você ainda não tem favoritos</h2>
      <p>
        Para adicionar um local à sua lista de favoritos, basta clicar no ícone de estrela no cartão ou na página de detalhes do local.
      </p>
      <Link to="/locais" className="botao botao--primario inline-block mt-4">
        Explorar locais
      </Link>
    </output>
  );
}