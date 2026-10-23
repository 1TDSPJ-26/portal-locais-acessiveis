export type MotivoErro = "dados-invalidos" | "armazenamento-indisponivel" | "desconhecido";

export class ErroCarregamentoLocais extends Error {
  motivo: MotivoErro;

  constructor(motivo: MotivoErro, message: string) {
    super(message);
    this.motivo = motivo;
    this.name = "ErroCarregamentoLocais";
  }
}
