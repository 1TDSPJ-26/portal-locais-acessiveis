import { useRef, useState } from "react";
import type { FormEvent } from "react";
import TextField from "../../components/TextField/index";
import SelectField from "../../components/SelectField/index";
import TextAreaField from "../../components/TextAreaField/index";
import CheckboxField from "../../components/CheckboxField/index";
import {
  ROTULOS_CAMPOS,
  formularioValido,
  validarCampo,
  validarFormulario,
} from "../../utils/ValidarCadastro";
import type {
  CampoCadastro,
  ErrosCadastro,
} from "../../utils/ValidarCadastro";
import {
  categoriasLocais,
  DADOS_INICIAIS,
  UFS_BRASIL,
} from "../../types/local.ts";
import type { DadosFormularioLocal } from "../../types/local.ts";

// As categorias da listagem já são legíveis, então servem de valor e de rótulo.
const OPCOES_CATEGORIA = categoriasLocais.map((categoria) => ({
  valor: categoria,
  rotulo: categoria,
}));

const OPCOES_ESTADO = UFS_BRASIL.map((uf) => ({ valor: uf, rotulo: uf }));

const CLASSE_GRADE = "grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2";

type StatusEnvio = "idle" | "loading" | "success" | "error";

const CAMPOS_VALIDAVEIS: CampoCadastro[] = [
  "nome",
  "categoria",
  "descricao",
  "logradouro",
  "numero",
  "bairro",
  "cidade",
  "estado",
  "cep",
  "email",
  "telefone",
  "site",
];

function ehCampoCadastro(name: string): name is CampoCadastro {
  return CAMPOS_VALIDAVEIS.includes(name as CampoCadastro);
}

export default function Cadastro() {
  // Issue #15: campos controlados pelo estado (objeto único + manipulador genérico)
  const [form, setForm] = useState<DadosFormularioLocal>(DADOS_INICIAIS);
  const [erros, setErros] = useState<ErrosCadastro>({});

  const [status, setStatus] = useState<StatusEnvio>("idle");
  const [mensagem, setMensagem] = useState(
    "O formulário de cadastro aguarda a ligação com a lista de locais da aplicação.",
  );

  const resumoErrosRef = useRef<HTMLDivElement>(null);

  const camposComErro = CAMPOS_VALIDAVEIS.filter((campo) => erros[campo]);

  function atualizarCampo(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));

    if (typeof value === "string" && ehCampoCadastro(name) && erros[name]) {
      const mensagemErro = validarCampo(name, value);
      setErros((prev) => {
        const proximosErros = { ...prev };

        if (mensagemErro) {
          proximosErros[name] = mensagemErro;
        } else {
          delete proximosErros[name];
        }

        return proximosErros;
      });
    }
  }

  function validarCampoAoSair(name: string) {
    if (!ehCampoCadastro(name) || !erros[name]) {
      return;
    }

    const valor = String(form[name] ?? "");
    const mensagemErro = validarCampo(name, valor);

    setErros((prev) => {
      const proximosErros = { ...prev };

      if (mensagemErro) {
        proximosErros[name] = mensagemErro;
      } else {
        delete proximosErros[name];
      }

      return proximosErros;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "loading") {
      return;
    }

    const errosEncontrados = validarFormulario(form);
    setErros(errosEncontrados);

    if (!formularioValido(errosEncontrados)) {
      setStatus("error");
      setMensagem("Corrija os campos indicados antes de enviar o cadastro.");
      window.setTimeout(() => resumoErrosRef.current?.focus(), 0);
      return;
    }

    // A chamada a cadastrarLocal, com os estados de envio, sucesso e erro,
    // permanece pendente: ver a Issue aberta na sequência da Issue #17.
    setStatus("error");
    setMensagem("Cadastro indisponível até a ligação com a lista de locais.");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left text-(--ink)">
      <h1>Cadastro</h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
        {camposComErro.length > 0 && (
          <div
            ref={resumoErrosRef}
            role="alert"
            tabIndex={-1}
            className="rounded-md border border-red-600 bg-red-50 px-4 py-3 text-red-900 outline-none focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2 focus-visible:ring-offset-(--paper)"
          >
            <h2 className="text-base font-semibold">
              Corrija os campos antes de enviar
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {camposComErro.map((campo) => (
                <li key={campo}>
                  <a href={`#${campo}`} className="underline underline-offset-2">
                    {ROTULOS_CAMPOS[campo]}: {erros[campo]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--ink)">
            Identificação
          </legend>
          <div className={CLASSE_GRADE}>
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
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--ink)">
            Endereço
          </legend>
          <div className={CLASSE_GRADE}>
            <TextField
              id="logradouro"
              name="logradouro"
              label="Logradouro"
              value={form.logradouro}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.logradouro}
              fullWidth
            />
            <TextField
              id="numero"
              name="numero"
              label="Número"
              value={form.numero}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.numero}
            />
            <TextField
              id="complemento"
              name="complemento"
              label="Complemento"
              value={form.complemento}
              onChange={atualizarCampo}
            />
            <TextField
              id="bairro"
              name="bairro"
              label="Bairro"
              value={form.bairro}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.bairro}
            />
            <TextField
              id="cidade"
              name="cidade"
              label="Cidade"
              value={form.cidade}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.cidade}
            />
            <SelectField
              id="estado"
              name="estado"
              label="Estado (UF)"
              value={form.estado}
              options={OPCOES_ESTADO}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.estado}
              placeholder="Selecione a UF"
            />
            <TextField
              id="cep"
              name="cep"
              label="CEP"
              value={form.cep}
              onChange={atualizarCampo}
              onBlur={validarCampoAoSair}
              error={erros.cep}
              placeholder="00000-000"
            />
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--ink)">
            Recursos de acessibilidade
          </legend>
          <div className={CLASSE_GRADE}>
            <CheckboxField
              id="rampaAcesso"
              name="rampaAcesso"
              label="Rampa de acesso"
              checked={form.rampaAcesso}
              onChange={atualizarCampo}
            />
            <CheckboxField
              id="banheiroAdaptado"
              name="banheiroAdaptado"
              label="Banheiro adaptado"
              checked={form.banheiroAdaptado}
              onChange={atualizarCampo}
            />
            <CheckboxField
              id="sinalizacaoTatil"
              name="sinalizacaoTatil"
              label="Sinalização tátil"
              checked={form.sinalizacaoTatil}
              onChange={atualizarCampo}
            />
            <CheckboxField
              id="pisoTatil"
              name="pisoTatil"
              label="Piso tátil"
              checked={form.pisoTatil}
              onChange={atualizarCampo}
            />
            <CheckboxField
              id="vagasPreferenciais"
              name="vagasPreferenciais"
              label="Vagas preferenciais"
              checked={form.vagasPreferenciais}
              onChange={atualizarCampo}
            />
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-(--control) bg-(--card) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--ink)">
            Contato
          </legend>
          <div className={CLASSE_GRADE}>
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

        <button
          type="submit"
          disabled={status === "loading"}
          className="self-start rounded-md bg-(--accent) px-7 py-3 font-semibold text-white transition hover:brightness-95"
        >
          {status === "loading" ? "Enviando..." : "Cadastrar local"}
        </button>
      </form>

      <div role={status === "error" ? "alert" : "status"} aria-live="polite">
        {status === "loading" ? "Enviando..." : mensagem}
      </div>
    </div>
  );
}
