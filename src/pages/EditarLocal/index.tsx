import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import TextField from "../../components/TextField/index";
import SelectField from "../../components/SelectField/index";
import TextAreaField from "../../components/TextAreaField/index";
import CheckboxField from "../../components/CheckboxField/index";
import {
    categoriasLocais,
    recursosAcessibilidade,
    type CategoriaLocal,
} from "../../types/local";
import type { RecursoAcessibilidade } from "../../types/local";
import { LocalDuplicadoError } from "../../services/cadastroLocal";
import { useLocais } from "../../useLocais";
import { buscarLocalPorId } from "../../utils/buscar-local-por-id";
import {
    validarCategoria,
    validarDescricao,
    validarEmail,
    validarNome,
    validarSite,
    validarTelefone,
} from "../../utils/ValidarCadastro";

const OPCOES_CATEGORIA = categoriasLocais.map((categoria) => ({
    valor: categoria,
    rotulo: categoria,
}));

const idDoRecurso = (recurso: RecursoAcessibilidade) =>
    `recurso-${recurso
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`;

function validarEdicao(dados: {
    nome: string;
    categoria: string;
    descricao: string;
    endereco: string;
    email: string;
    telefone: string;
    site: string;
}): Record<string, string> {
    const erros: Record<string, string> = {};

    const mensagemNome = validarNome(dados.nome);
    if (mensagemNome) erros.nome = mensagemNome;

    const mensagemCategoria = validarCategoria(dados.categoria);
    if (mensagemCategoria) erros.categoria = mensagemCategoria;

    const mensagemDescricao = validarDescricao(dados.descricao);
    if (mensagemDescricao) erros.descricao = mensagemDescricao;

    if (!dados.endereco.trim()) {
        erros.endereco = "O endereço é obrigatório.";
    }

    const mensagemEmail = validarEmail(dados.email);
    if (mensagemEmail) erros.email = mensagemEmail;

    const mensagemTelefone = validarTelefone(dados.telefone);
    if (mensagemTelefone) erros.telefone = mensagemTelefone;

    const mensagemSite = validarSite(dados.site);
    if (mensagemSite) erros.site = mensagemSite;

    return erros;
}

export default function EditarLocal() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { locais, estado, atualizarLocal, tentarNovamente } = useLocais();
    const resumoErrosRef = useRef<HTMLDivElement>(null);

    const local = useMemo(() => buscarLocalPorId(locais, id), [locais, id]);

    const [form, setForm] = useState(() => ({
        nome: local?.nome ?? "",
        categoria: local?.categoria ?? "",
        descricao: local?.descricao ?? "",
        endereco: local?.endereco ?? "",
        recursos: [...(local?.recursos ?? [])],
        email: local?.email ?? "",
        telefone: local?.telefone ?? "",
        site: local?.site ?? "",
    }));
    const [erros, setErros] = useState<Record<string, string>>({});
    const [mensagem, setMensagem] = useState("");

    if (estado === "carregando") {
        return (
            <div className="app-shell content">
                <h1>Editar local</h1>
                <output aria-live="polite">Carregando local...</output>
            </div>
        );
    }

    if (estado === "erro") {
        return (
            <div className="app-shell content">
                <h1>Não foi possível carregar o local</h1>
                <p role="alert">Tente novamente para consultar as informações do local.</p>
                <button
                    className="clear-button prominent"
                    type="button"
                    onClick={tentarNovamente}
                >
                    Tentar novamente
                </button>
                <p><Link to="/locais">Voltar para a listagem de locais</Link></p>
            </div>
        );
    }

    if (!local) {
        return (
            <div className="app-shell content">
                <h1>Local não encontrado</h1>
                <p>Não existe um local com o identificador informado.</p>
                <Link to="/locais">Voltar para a listagem de locais</Link>
            </div>
        );
    }

    const camposComErro = Object.entries(erros)
        .filter(([, valor]) => Boolean(valor))
        .map(([campo]) => campo);

    const atualizarCampo = (name: string, value: string) => {
        setForm((anterior) => ({ ...anterior, [name]: value }));

        if (erros[name]) {
            setErros((anterior) => {
                const proximo = { ...anterior };
                delete proximo[name];
                return proximo;
            });
        }
    };

    const alternarRecurso = (recurso: RecursoAcessibilidade) => {
        setForm((anterior) => ({
            ...anterior,
            recursos: anterior.recursos.includes(recurso)
                ? anterior.recursos.filter((item) => item !== recurso)
                : [...anterior.recursos, recurso],
        }));
    };

    const validarCampoAoSair = (name: string) => {
        if (!erros[name]) {
            return;
        }

        const proximoErro = validarEdicao({
            nome: form.nome,
            categoria: form.categoria,
            descricao: form.descricao,
            endereco: form.endereco,
            email: form.email,
            telefone: form.telefone,
            site: form.site,
        })[name];

        setErros((anterior) => {
            const proximo = { ...anterior };
            if (proximoErro) {
                proximo[name] = proximoErro;
            } else {
                delete proximo[name];
            }
            return proximo;
        });
    };

    const salvarEdicao = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const errosEncontrados = validarEdicao(form);
        setErros(errosEncontrados);

        if (Object.keys(errosEncontrados).length > 0) {
            setMensagem("");
            window.setTimeout(() => resumoErrosRef.current?.focus(), 0);
            return;
        }

        const categoria = form.categoria as CategoriaLocal;
        if (!categoriasLocais.includes(categoria)) {
            setMensagem("Selecione uma categoria válida para continuar.");
            return;
        }

        try {
            atualizarLocal(local.id, {
                nome: form.nome.trim(),
                categoria,
                endereco: form.endereco.trim(),
                recursos: [...form.recursos],
                descricao: form.descricao.trim() || undefined,
                email: form.email.trim() || undefined,
                telefone: form.telefone.trim() || undefined,
                site: form.site.trim() || undefined,
            });

            navigate(`/locais/${local.id}`, {
                state: { mensagem: `${form.nome.trim()} foi atualizado com sucesso.` },
            });
        } catch (erro) {
            setMensagem(
                erro instanceof LocalDuplicadoError
                    ? erro.message
                    : "Não foi possível atualizar o local. Confira os dados e tente novamente.",
            );
        }
    };

    return (
        <div key={local.id} className="mx-auto w-full max-w-3xl px-4 py-8 text-left text-(--ink)">
            <h1>Editar local</h1>

            <form className="flex flex-col gap-6" onSubmit={salvarEdicao} noValidate>
                {camposComErro.length > 0 && (
                    <div
                        ref={resumoErrosRef}
                        role="alert"
                        tabIndex={-1}
                        className="rounded-md border-2 border-(--alert) bg-(--card) px-4 py-3 text-(--ink) outline-none focus-visible:ring-2 focus-visible:ring-(--alert) focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper)"
                    >
                        <h2 className="text-base font-semibold text-(--alert)">Corrija os campos antes de enviar</h2>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                            {camposComErro.map((campo) => (
                                <li key={campo}>{campo}: {erros[campo]}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
                    <legend className="px-2 text-sm font-semibold text-(--ink)">Dados do local</legend>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                        <TextField
                            id="nome"
                            name="nome"
                            label="Nome do local"
                            value={form.nome}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.nome}
                        />
                        <SelectField
                            id="categoria"
                            name="categoria"
                            label="Categoria"
                            value={form.categoria}
                            options={OPCOES_CATEGORIA}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.categoria}
                            placeholder="Selecione a categoria"
                        />
                        <TextAreaField
                            id="descricao"
                            name="descricao"
                            label="Descrição"
                            value={form.descricao}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.descricao}
                            fullWidth
                        />
                        <TextField
                            id="endereco"
                            name="endereco"
                            label="Endereço"
                            value={form.endereco}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.endereco}
                            fullWidth
                        />
                    </div>
                </fieldset>

                <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
                    <legend className="px-2 text-sm font-semibold text-(--ink)">Recursos de acessibilidade</legend>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                        {recursosAcessibilidade.map((recurso) => (
                            <CheckboxField
                                key={recurso}
                                id={idDoRecurso(recurso)}
                                name={recurso}
                                label={recurso}
                                checked={form.recursos.includes(recurso)}
                                onChange={() => alternarRecurso(recurso)}
                            />
                        ))}
                    </div>
                </fieldset>

                <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
                    <legend className="px-2 text-sm font-semibold text-(--ink)">Contato</legend>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                        <TextField
                            id="email"
                            name="email"
                            label="E-mail"
                            type="email"
                            value={form.email}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.email}
                        />
                        <TextField
                            id="telefone"
                            name="telefone"
                            label="Telefone"
                            type="tel"
                            value={form.telefone}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.telefone}
                        />
                        <TextField
                            id="site"
                            name="site"
                            label="Site"
                            type="url"
                            value={form.site}
                            onChange={atualizarCampo}
                            onBlur={validarCampoAoSair}
                            error={erros.site}
                            fullWidth
                        />
                    </div>
                </fieldset>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        className="rounded-md bg-(--accent) px-7 py-3 font-semibold text-black transition hover:brightness-95"
                    >
                        Salvar alterações
                    </button>
                    <button
                        type="button"
                        className="rounded-md border border-(--control) bg-(--card) px-7 py-3 font-semibold text-(--ink)"
                        onClick={() => navigate(`/locais/${local.id}`)}
                    >
                        Cancelar
                    </button>
                </div>
            </form>

            {mensagem && (
                <div role="alert" className="mt-4 text-sm font-medium text-(--alert)">
                    {mensagem}
                </div>
            )}
        </div>
    );
}
