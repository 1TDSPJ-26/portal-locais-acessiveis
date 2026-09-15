import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>O endereço que você tentou acessar não foi encontrado.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </main>
  );
}
