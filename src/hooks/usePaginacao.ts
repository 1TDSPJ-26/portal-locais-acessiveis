import { useMemo, useRef, useState } from "react";

export function usePaginacao<T>(filtrados: T[]) {
    const [pagina, setPagina] = useState<number>(1);
    const [porPagina, setPorPagina] = useState<number>(10);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
    const paginaAtual = Math.min(pagina, totalPaginas);

    const inicio = (paginaAtual - 1) * porPagina;

    const visiveis = useMemo(
        () => filtrados.slice(inicio, inicio + porPagina),
        [filtrados, inicio, porPagina]
    );

    const topoListaRef = useRef<HTMLElement | null>(null);

    function handleMudarPagina(novaPagina: number) {
        setPagina(novaPagina);
        // mover foco para o topo da lista (se anexado pela UI)
        topoListaRef.current?.focus();
    }

    function handleMudarPorPagina(novoValor: number) {
        setPorPagina(novoValor);
        // paginaAtual é derivado e fará o clamp automaticamente
    }

    // Handler que o componente de busca/filters deve chamar ao alterar o termo/filtros
    function handleFiltroAlterado() {
        setPagina(1);
    }

    return {
        paginaAtual,
        totalPaginas,
        visiveis,
        porPagina,
        topoListaRef,
        handleMudarPagina,
        handleMudarPorPagina,
        handleFiltroAlterado,
    } as const;
}
