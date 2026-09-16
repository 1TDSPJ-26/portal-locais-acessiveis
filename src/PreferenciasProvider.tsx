import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { PreferenciasContext } from "./PreferenciasContext";
import type { Fonte, Preferencias } from "./PreferenciasContext";

const PADRAO: Preferencias = { fonte: "normal", contraste: "normal" };
const CHAVE = "preferencias-exibicao";

function carregarPreferencias(): Preferencias {
  try {
    const salvo: unknown = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
    if (salvo && typeof salvo === "object") {
      const valor = salvo as Partial<Preferencias>;
      return {
        fonte: valor.fonte === "grande" || valor.fonte === "maior" ? valor.fonte : "normal",
        contraste: valor.contraste === "alto" ? "alto" : "normal",
      };
    }
  } catch {
    // Sem armazenamento disponível, mantém o padrão.
  }
  return PADRAO;
}

export function PreferenciasProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(carregarPreferencias);

  useEffect(() => {
    document.documentElement.dataset.fonte = preferencias.fonte;
    document.documentElement.dataset.contraste = preferencias.contraste;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(preferencias));
    } catch {
      // A preferência continua ativa nesta sessão.
    }
  }, [preferencias]);

  const definirFonte = (fonte: Fonte) => setPreferencias((atual) => ({ ...atual, fonte }));
  const alternarContraste = () => setPreferencias((atual) => ({
    ...atual,
    contraste: atual.contraste === "alto" ? "normal" : "alto",
  }));
  const restaurar = () => setPreferencias(PADRAO);

  return (
    <PreferenciasContext.Provider value={{ ...preferencias, definirFonte, alternarContraste, restaurar }}>
      {children}
    </PreferenciasContext.Provider>
  );
}
