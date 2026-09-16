import { useState, type FormEvent } from "react";

type StatusEnvio = "idle" | "loading" | "success" | "error";

export default function Cadastro() {
  const [status, setStatus] = useState<StatusEnvio>("idle");
  const [mensagem, setMensagem] = useState(
    "O formulário de cadastro aguarda a definição dos campos e do contrato da API.",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    // TODO (Issue 14): validar os campos aprovados e chamar o serviço quando
    // endpoint, método, corpo e resposta da API estiverem documentados.
    setStatus("error");
    setMensagem("Cadastro indisponível enquanto o contrato da API não for definido.");
  }

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        {/* TODO (Issue 13): adicionar somente campos e validações aprovados. */}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Enviando..." : "Cadastrar local"}
        </button>
      </form>
      <div role={status === "error" ? "alert" : "status"} aria-live="polite">
        {status === "loading" ? "Enviando..." : mensagem}
      </div>
    </div>
  );
}
