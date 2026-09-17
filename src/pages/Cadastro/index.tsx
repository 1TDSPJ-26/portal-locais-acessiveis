import { useState, type FormEvent } from "react";

type StatusEnvio = "idle" | "loading" | "success" | "error";

export default function Cadastro() {
  const [status, setStatus] = useState<StatusEnvio>("idle");
  const [mensagem, setMensagem] = useState(
    "O formulário de cadastro aguarda a conclusão dos campos e da validação.",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    // A integração com cadastrarLocal depende dos campos e da validação
    // previstos nas Issues #15 e #16.
    setStatus("error");
    setMensagem("Cadastro indisponível até a conclusão do formulário.");
  }

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        {/* Os campos e a validação pertencem às Issues #15 e #16. */}
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
