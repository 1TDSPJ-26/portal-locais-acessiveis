import { useMemo, useRef, useState } from "react";

export function usePaginacao<T>(filtrados: T[], optionsPorPagina?: number[]) {
    const [pagina, setPagina] = useState<number>(1);
    const [porPagina, setPorPagina] = useState<number>(10);

    const availableOptions = optionsPorPagina ?? [10, 20, 50];
        
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
        topoListaRef.current?.focus();
    }

    function handleMudarPorPagina(novoValor: number) {
        setPorPagina(novoValor);
    }

    // Handler que o componente de busca/filters deve chamar ao alterar o termo/filtros
    function handleFiltroAlterado() {
        setPagina(1);
    }

    // Contador de intervalo e total
    const totalItems = filtrados.length;
    const intervaloInicio = totalItems === 0 ? 0 : inicio + 1;
    const intervaloFim = Math.min(inicio + visiveis.length, totalItems);
    const intervaloLabel = `Exibindo ${intervaloInicio} a ${intervaloFim} de ${totalItems} itens`;

    // Auxiliares para UI: páginas e status de controles
    const pages = Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const canPrev = paginaAtual > 1;
    const canNext = paginaAtual < totalPaginas;
    const isSinglePage = totalPaginas === 1;

    return {
        paginaAtual,
        totalPaginas,
        visiveis,
        porPagina,
        availableOptions,
        intervaloInicio,
        intervaloFim,
        totalItems,
        intervaloLabel,
        pages,
        canPrev,
        canNext,
        isSinglePage,
        topoListaRef,
        handleMudarPagina,
        handleMudarPorPagina,
        handleFiltroAlterado,
    } as const;

   
}
