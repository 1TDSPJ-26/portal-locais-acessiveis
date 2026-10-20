
const CHAVE_HISTORICO = "historico-buscas";
const LIMITE_HISTORICO = 5;


function normalizarTermo(termo: string): string {
    return termo
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}


export function adicionarAoHistorico(
    lista: string[],
    termo: string,
): string[] {
    const termoLimpo = termo.trim().replace(/\s+/g, " ");

    if (termoLimpo.length < 2) {
    return lista.slice(0, LIMITE_HISTORICO);
    }

    const termoNormalizado = normalizarTermo(termoLimpo);

    const historicoSemRepeticao = lista.filter(
    (item) => normalizarTermo(item) !== termoNormalizado,
    );

    return [termoLimpo, ...historicoSemRepeticao].slice(
    0,
    LIMITE_HISTORICO,
    );
}

export function carregarHistorico(): string[] {
    try {
    const dados = localStorage.getItem(CHAVE_HISTORICO);

    if (!dados) {
        return [];
    }

    const lista: unknown = JSON.parse(dados);

    if (!Array.isArray(lista)) {
        return [];
    }

    const termosValidos = lista.filter(
        (item): item is string =>
        typeof item === "string" && item.trim().length >= 2,
    );

    return termosValidos.reduce<string[]>(
        (historico, termo) => adicionarAoHistorico(historico, termo),
        [],
    );
    } catch {
    return [];
    }
}


export function salvarHistorico(lista: string[]): void {
    try {
    const historico = lista.reduce<string[]>(
        (resultado, termo) => adicionarAoHistorico(resultado, termo),
        [],
    );

    localStorage.setItem(
        CHAVE_HISTORICO,
        JSON.stringify(historico),
    );
    } catch {
    }
}
