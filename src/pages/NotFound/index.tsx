import { Link } from "react-router";
export default function NotFound() {
  return (
    <div className="app-shell content">
      <title>
        Página não encontrada | Portal de Locais e Serviços Acessíveis
      </title>
      <h1>Página não encontrada</h1>
      <p>O endereço que você acessou não existe.</p>
      <div>
        <Link to="/" className="botao botao--secundario">
          Página inicial
        </Link>
        <Link to="/locais" className="botao botao--secundario">
          Ver locais
        </Link>
      </div>
    </div>
  );
}
