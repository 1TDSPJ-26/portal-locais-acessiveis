import { Children, Fragment, isValidElement } from "react";
import type { ComponentPropsWithRef, ReactNode } from "react";

export type TipoMensagem = "erro" | "sucesso" | "aviso";

interface MensagemProps extends Omit<ComponentPropsWithRef<"div">, "children" | "role" | "aria-live"> {
  tipo: TipoMensagem;
  children?: ReactNode;
  variante?: "painel" | "campo";
  /** Desative em descrições de campo ou dentro de outra região viva. */
  anunciar?: boolean;
}

const ROTULOS: Record<TipoMensagem, string> = {
  erro: "Erro",
  sucesso: "Sucesso",
  aviso: "Aviso",
};

function possuiConteudo(children: ReactNode): boolean {
  return Children.toArray(children).some((filho) => {
    if (isValidElement<{ children?: ReactNode }>(filho) && filho.type === Fragment) {
      return possuiConteudo(filho.props.children);
    }
    return typeof filho === "string" ? filho.trim().length > 0 : true;
  });
}

/** Pode permanecer vazia no DOM para anunciar atualizações posteriores. */
export default function Mensagem({
  tipo,
  children,
  variante = "painel",
  anunciar = true,
  className = "",
  ...props
}: MensagemProps) {
  const temConteudo = possuiConteudo(children);

  return (
    <div
      {...props}
      className={`mensagem mensagem--${tipo} mensagem--${variante} ${className}`.trim()}
      role={anunciar ? (tipo === "erro" ? "alert" : "status") : undefined}
      aria-live={anunciar ? (tipo === "erro" ? "assertive" : "polite") : undefined}
      aria-atomic={anunciar ? true : undefined}
    >
      {temConteudo && (
        <>
          <strong className="mensagem-tipo">{ROTULOS[tipo]}:</strong>
          <div className="mensagem-conteudo">{children}</div>
        </>
      )}
    </div>
  );
}
