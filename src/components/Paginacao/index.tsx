type PaginacaoProps = {
    paginaAtual: number;
    pages: number[];
    canPrev: boolean;
    canNext: boolean;
    isSinglePage: boolean;
    intervaloLabel: string;
    porPagina: number;
    availableOptions: number[];
    onMudarPagina: (pagina: number) => void;
    onMudarPorPagina: (porPagina: number) => void;
};

export function Paginacao({
    paginaAtual,
    pages,
    canPrev,
    canNext,
    isSinglePage,
    intervaloLabel,
    porPagina,
    availableOptions,
    onMudarPagina,
    onMudarPorPagina,
}: PaginacaoProps) {
    // Se existir apenas uma página,
    // não precisamos mostrar a paginação.
    if (isSinglePage) {
        return null;
    }

    return (
        <>
            <p>
                <output aria-live="polite" aria-atomic="true">
                    {intervaloLabel}
                </output>
            </p>
            <div className="paginacao-por-pagina">
                <label htmlFor="locais-por-pagina">Locais por página</label>
                <select
                    id="locais-por-pagina"
                    value={porPagina}
                    onChange={(e) => onMudarPorPagina(Number(e.target.value))}
                >
                    {availableOptions.map((opcao) => (
                        <option key={opcao} value={opcao}>
                            {opcao}
                        </option>
                    ))}
                </select>
            </div>

            <nav aria-label="Paginação" className="paginacao">
                <button
                    type="button"
                    aria-label="Página anterior"
                    onClick={() => onMudarPagina(paginaAtual - 1)}
                    disabled={!canPrev}
                >
                    Anterior
                </button>

                {pages.map((n) => (
                    <button
                        key={n}
                        type="button"
                        aria-label={`Página ${n}`}
                        onClick={() => onMudarPagina(n)}
                        aria-current={n === paginaAtual ? "page" : undefined}
                    >
                        {n}
                    </button>
                ))}

                <button
                    type="button"
                    aria-label="Próxima página"
                    onClick={() => onMudarPagina(paginaAtual + 1)}
                    disabled={!canNext}
                >
                    Próxima
                </button>
            </nav>
        </>
    );
}