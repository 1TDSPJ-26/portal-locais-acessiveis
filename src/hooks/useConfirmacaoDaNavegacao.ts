import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";

import {
    obterConfirmacaoDoEstado,
    removerConfirmacaoDoEstado,
} from "../utils/confirmacao-da-navegacao";

export default function useConfirmacaoDaNavegacao(): string | null {
    const location = useLocation();
    const navigate = useNavigate();
    const confirmacao = obterConfirmacaoDoEstado(location.state);
    const consumiuRef = useRef(false);

    useEffect(() => {
        if (!confirmacao || consumiuRef.current) {
            return;
        }

        consumiuRef.current = true;

        const estadoSemConfirmacao = removerConfirmacaoDoEstado(location.state);
        void navigate(
            { pathname: location.pathname, search: location.search },
            { replace: true, state: estadoSemConfirmacao },
        );
    }, [confirmacao, location.pathname, location.search, location.state, navigate]);

    return confirmacao;
}
