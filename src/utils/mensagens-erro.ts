type MotivoErro = "dados-invalidos" | "armazenamento-indisponivel" | "desconhecido";

export function getMensagemErro(motivo: MotivoErro): { titulo: string; texto: string } {
  switch (motivo) {
    case "dados-invalidos":
      return {
        titulo: "Lista de locais com problema",
        texto: "Os dados salvos estão em um formato que não reconhecemos. Estamos usando os locais de exemplo.",
      };
      case "armazenamento-indisponivel":
        return {
          titulo: "Lista de locais com problema",
          texto: "Os dados salvos estão em um formato que não reconhecemos. Estamos usando os locais de exemplo.",
        };
      default:
        return {
          titulo: "Lista de locais com problema",
          texto: "Os dados salvos estão em um formato que não reconhecemos. Estamos usando os locais de exemplo.",
        };
  }
}