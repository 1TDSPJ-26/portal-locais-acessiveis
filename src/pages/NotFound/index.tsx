import { Link } from "react-router";
export default function NotFound() {
  return (
    <div>
      <title>Página não encontrada | Portal de Locais e Serviços Acessíveis</title>

      <h1>404</h1>
      <h2>Página não encontrada</h2>
      <p>O endereço que você tentou acessar não foi encontrado.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}
