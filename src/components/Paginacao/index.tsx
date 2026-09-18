
type PaginacaoProps = {
    paginaAtual: number;
    pages: number[];
    canPrev: boolean;
    canNext: boolean;
    isSinglePage: boolean;
    onMudarPagina: (pagina: number) => void;
};

export function Paginacao({
    paginaAtual,
    pages,
    canPrev,
    canNext,
    isSinglePage,
    onMudarPagina,
}: PaginacaoProps) {
    // Se existir apenas uma página,
    // não precisamos mostrar a paginação.
    if (isSinglePage) {
        return null;
    }

    return (
        <nav aria-label="Paginação">
            <button
                type="button"
                onClick={() => onMudarPagina(paginaAtual - 1)}
                disabled={!canPrev}
            >
                Anterior
            </button>

            {pages.map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onMudarPagina(n)}
                    aria-current={
                        n === paginaAtual ? "page" : undefined
                    }
                >
                    {n}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onMudarPagina(paginaAtual + 1)}
                disabled={!canNext}
            >
                Próxima
            </button>
        </nav>
    );
}

