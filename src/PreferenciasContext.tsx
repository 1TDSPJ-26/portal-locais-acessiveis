import { createContext, useContext } from "react";

export type Fonte = "normal" | "grande" | "maior";
export type Contraste = "normal" | "alto";
export type Preferencias = { fonte: Fonte; contraste: Contraste };

type PreferenciasContextValue = Preferencias & {
  definirFonte: (fonte: Fonte) => void;
  alternarContraste: () => void;
  restaurar: () => void;
};

export const PreferenciasContext = createContext<PreferenciasContextValue | null>(null);

export function usePreferencias() {
  const contexto = useContext(PreferenciasContext);
  if (!contexto) throw new Error("usePreferencias deve ser usado dentro de PreferenciasProvider");
  return contexto;
}
