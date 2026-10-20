// Outra tela envia uma confirmação em location.state.confirmacao para esta página mostrar uma única vez.
import Mensagem from "../Mensagem";
import useConfirmacaoDaNavegacao from "../../hooks/useConfirmacaoDaNavegacao";

export default function MensagemConfirmacao() {
    const confirmacao = useConfirmacaoDaNavegacao();

    // Fica no DOM mesmo vazia: o leitor de tela só anuncia a região viva que já existia.
    return (
        <Mensagem tipo="sucesso" className={confirmacao ? "mb-4" : undefined}>
            {confirmacao}
        </Mensagem>
    );
}
