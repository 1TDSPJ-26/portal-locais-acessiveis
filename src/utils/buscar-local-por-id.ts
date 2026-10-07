import type { Local } from "../types/local.ts";

export const buscarLocalPorId = (locais: Local[], id: string | undefined) =>
  locais.find((local) => String(local.id) === id);
