export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// TODO (Issue 14): implementar cadastrarLocal quando o contrato da API
// informar endpoint, método, campos do corpo e formato da resposta.
