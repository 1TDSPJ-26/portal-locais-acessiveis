import { useContext } from "react";
import { LocaisContext } from "./LocaisContext";

export function useLocais() {
  const contexto = useContext(LocaisContext);
  if (!contexto) {
    throw new Error("useLocais deve ser usado dentro de LocaisProvider");
  }
  return contexto;
}
