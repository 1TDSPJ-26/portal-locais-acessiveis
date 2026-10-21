export function obterConfirmacaoDoEstado(estado: unknown): string | null {
    if (typeof estado !== "object" || estado === null) {
        return null;
    }

    const confirmacao = (estado as { confirmacao?: unknown }).confirmacao;
    return typeof confirmacao === "string" && confirmacao.trim().length > 0
        ? confirmacao
        : null;
}

export function removerConfirmacaoDoEstado<T>(estado: T): T | null {
    if (typeof estado !== "object" || estado === null) {
        return null;
    }

    const proximoEstado = { ...(estado as Record<string, unknown>) };
    delete proximoEstado.confirmacao;

    return Object.keys(proximoEstado).length > 0 ? (proximoEstado as T) : null;
}
