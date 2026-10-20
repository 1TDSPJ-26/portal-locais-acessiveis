// Outra tela envia uma confirmação em location.state.confirmacao para esta página mostrar uma única vez.
import Mensagem from "../Mensagem";
import useConfirmacaoDaNavegacao from "../../hooks/useConfirmacaoDaNavegacao";

export default function MensagemConfirmacao() {
    const confirmacao = useConfirmacaoDaNavegacao();

    if (!confirmacao) {
        return null;
    }

    return <Mensagem tipo="sucesso">{confirmacao}</Mensagem>;
}
