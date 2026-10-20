import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import {
    obterConfirmacaoDoEstado,
    removerConfirmacaoDoEstado,
} from "../utils/confirmacao-da-navegacao";

export default function useConfirmacaoDaNavegacao(): string | null {
    const location = useLocation();
    const navigate = useNavigate();
    const recebida = obterConfirmacaoDoEstado(location.state);
    // Guarda o texto, porque o efeito abaixo limpa o histórico e, sem isso,
    // a confirmação sumiria logo após aparecer.
    const [confirmacao, setConfirmacao] = useState(recebida);

    if (recebida && recebida !== confirmacao) {
        setConfirmacao(recebida);
    }

    useEffect(() => {
        if (!recebida) {
            return;
        }

        const estadoSemConfirmacao = removerConfirmacaoDoEstado(location.state);
        void navigate(
            { pathname: location.pathname, search: location.search },
            { replace: true, state: estadoSemConfirmacao },
        );
    }, [recebida, location.pathname, location.search, location.state, navigate]);

    return confirmacao;
}
