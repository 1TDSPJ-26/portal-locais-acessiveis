export const CHAVE_FAVORITOS = "locais-favoritos";

export function alternarFavorito(ids: readonly number[], id: number): number[] {
  if (!Number.isInteger(id)) return [...ids];

  return ids.includes(id)
    ? ids.filter((favorito) => favorito !== id)
    : [...ids, id];
}

export function validarFavoritos(valor: unknown): number[] | null {
  if (!Array.isArray(valor)) return null;

  const encontrados = new Set<number>();
  for (const id of valor) {
    if (typeof id !== "number" || !Number.isInteger(id) || encontrados.has(id)) {
      return null;
    }
    encontrados.add(id);
  }

  return [...valor];
}

export function carregarFavoritos(): number[] {
  try {
    const salvo = localStorage.getItem(CHAVE_FAVORITOS);
    if (salvo === null) return [];
    return validarFavoritos(JSON.parse(salvo)) ?? [];
  } catch {
    // Conteúdo corrompido ou armazenamento indisponível não impede o uso.
    return [];
  }
}

export function salvarFavoritos(ids: readonly number[]): void {
  const validos = validarFavoritos(ids);
  if (validos === null) return;

  try {
    localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(validos));
  } catch {
    // O Provider mantém os favoritos em memória durante a sessão.
  }
}
