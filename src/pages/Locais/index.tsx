
import { useRef, useState } from "react";

type Local = {
  id: number;
  nome: string;
  categoria?: "Cultura" | "Educação" | "Lazer" | "Saúde";
  endereco?: string;
};

const locais: Local[] = [
  { id: 1, nome: "Local 1" },
  { id: 2, nome: "Local 2" },
  { id: 3, nome: "Local 3" },
  { id: 4, nome: "Local 4" },
  { id: 5, nome: "Local 5" },
  { id: 6, nome: "Local 6" },
  { id: 7, nome: "Local 7" },
  { id: 8, nome: "Local 8" },
  { id: 9, nome: "Local 9" },
  { id: 10, nome: "Local 10" },
  { id: 11, nome: "Local 11" },
];

const opcoesPorPagina = [5, 10, 20];

export default function Locais() {
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const inicioListagemRef = useRef<HTMLHeadingElement>(null);

  const filtrados = locais.filter((local) => {
    const correspondeAoTermo = `${local.nome} ${local.endereco ?? ""}`
      .toLocaleLowerCase("pt-BR")
      .includes(termo.trim().toLocaleLowerCase("pt-BR"));

    const correspondeACategoria =
      categoria === "todas" || local.categoria === categoria;

    return correspondeAoTermo && correspondeACategoria;
  });

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / porPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);

  const inicio = (paginaAtual - 1) * porPagina;

  const visiveis = filtrados.slice(
    inicio,
    inicio + porPagina
  );

  const primeiroItem =
    filtrados.length === 0 ? 0 : inicio + 1;

  const ultimoItem = Math.min(
    inicio + porPagina,
    filtrados.length
  );

  function handleTermoChange(novoTermo: string) {
    setTermo(novoTermo);
    setPagina(1);
  }

  function handleCategoriaChange(novaCategoria: string) {
    setCategoria(novaCategoria);
    setPagina(1);
  }

  function irParaPagina(novaPagina: number) {
    setPagina(novaPagina);
    inicioListagemRef.current?.focus();
  }

  return (
    <section className="locais">
      <h1>Locais</h1>

      <div
        className="locais-filtros"
        aria-label="Filtros de locais"
      >
        <label>
          Buscar local

          <input
            type="search"
            value={termo}
            onChange={(event) =>
              handleTermoChange(event.target.value)
            }
            placeholder="Nome ou endereço"
          />
        </label>

        <label>
          Categoria

          <select
            value={categoria}
            onChange={(event) =>
              handleCategoriaChange(event.target.value)
            }
          >
            <option value="todas">Todas</option>
            <option value="Cultura">Cultura</option>
            <option value="Educação">Educação</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
          </select>
        </label>
      </div>

      <div className="locais-resumo">
        <p aria-live="polite">
          Exibindo {primeiroItem} a {ultimoItem} de{" "}
          {filtrados.length} locais
        </p>

        <label>
          Itens por página

          <select
            value={porPagina}
            onChange={(event) =>
              setPorPagina(Number(event.target.value))
            }
          >
            {opcoesPorPagina.map((opcao) => (
              <option key={opcao} value={opcao}>
                {opcao}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2
        id="inicio-listagem"
        ref={inicioListagemRef}
        tabIndex={-1}
      >
        Resultados
      </h2>

      {visiveis.length > 0 ? (
        <ul
          className="lista-locais"
          aria-label="Locais encontrados"
        >
          {visiveis.map((local) => (
            <li key={local.id}>
              <h3>{local.nome}</h3>

              <p>
                {local.categoria ?? "Categoria não informada"} ·{" "}
                {local.endereco ?? "Endereço não informado"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <output>
          Nenhum local foi encontrado para os filtros informados.
        </output>
      )}

      {totalPaginas > 1 && (
        <nav
          className="paginacao"
          aria-label="Paginação"
        >
          <button
            type="button"
            onClick={() =>
              irParaPagina(paginaAtual - 1)
            }
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>

          {Array.from(
            { length: totalPaginas },
            (_, indice) => indice + 1
          ).map((numero) => (
            <a
              key={numero}
              href="#inicio-listagem"
              aria-current={
                numero === paginaAtual
                  ? "page"
                  : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                irParaPagina(numero);
              }}
            >
              {numero}
            </a>
          ))}

          <button
            type="button"
            onClick={() =>
              irParaPagina(paginaAtual + 1)
            }
            disabled={
              paginaAtual === totalPaginas
            }
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  );
}


