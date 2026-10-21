type MotivoErro = "dados-invalidos" | "armazenamento-indisponivel" | "desconhecido";

export function getMensagemErro(motivo: MotivoErro): { titulo: string; texto: string } {
  switch (motivo) {
    case "dados-invalidos":
      return {
        titulo: "Não conseguimos ler sua lista salva",
        texto: "Os dados deste aparelho parecem incompletos ou alterados. Vamos continuar com os locais de exemplo por enquanto.",
      };
    case "armazenamento-indisponivel":
      return {
        titulo: "Não foi possível acessar os dados deste aparelho",
        texto: "O armazenamento local não está disponível agora. Vamos mostrar os locais de exemplo até a conexão voltar ao normal.",
      };
    default:
      return {
        titulo: "Não foi possível carregar sua lista no momento",
        texto: "Ocorreu uma falha inesperada e vamos usar os locais de exemplo para que você continue navegando.",
      };
  }
}