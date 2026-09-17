import { useState } from "react";
import type { FormEvent } from "react";
import TextField from "../../components/TextField/index";
import SelectField from "../../components/SelectField/index";
import TextAreaField from "../../components/TextAreaField/index";
import CheckboxField from "../../components/CheckboxField/index";
import {
  CATEGORIAS_LOCAL,
  DADOS_INICIAIS,
  ROTULOS_CATEGORIA,
  UFS_BRASIL,
} from "../../types/local.ts";
import type { DadosFormularioLocal } from "../../types/local.ts";

const OPCOES_CATEGORIA = CATEGORIAS_LOCAL.map((categoria) => ({
  valor: categoria,
  rotulo: ROTULOS_CATEGORIA[categoria],
}));

const OPCOES_ESTADO = UFS_BRASIL.map((uf) => ({ valor: uf, rotulo: uf }));

const CLASSE_GRADE = "grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2";

type StatusEnvio = "idle" | "loading" | "success" | "error";

export default function Cadastro() {
  // Issue #15: campos controlados pelo estado (objeto único + manipulador genérico)
  const [form, setForm] = useState<DadosFormularioLocal>(DADOS_INICIAIS);

  const [status, setStatus] = useState<StatusEnvio>("idle");
  const [mensagem, setMensagem] = useState(
    "O formulário de cadastro aguarda a definição dos campos e do contrato da API.",
  );

  function atualizarCampo(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

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
    <div className="mx-auto w-full max-w-3xl px-4 py-8 text-left text-(--text)">
      <h1>Cadastro</h1>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        {/* TODO (Issue 13): adicionar somente campos e validações aprovados. */}

        <fieldset className="rounded-lg border border-(--border) bg-(--bg) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--text-h)">
            Identificação
          </legend>
          <div className={CLASSE_GRADE}>
            <TextField
              id="nome"
              name="nome"
              label="Nome do local"
              value={form.nome}
              onChange={atualizarCampo}
            />
            <SelectField
              id="categoria"
              name="categoria"
              label="Categoria"
              value={form.categoria}
              options={OPCOES_CATEGORIA}
              onChange={atualizarCampo}
            />
            <TextAreaField
              id="descricao"
              name="descricao"
              label="Descrição"
              value={form.descricao}
              onChange={atualizarCampo}
              fullWidth
            />
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-(--border) bg-(--bg) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--text-h)">
            Endereço
          </legend>
          <div className={CLASSE_GRADE}>
            <TextField
              id="logradouro"
              name="logradouro"
              label="Logradouro"
              value={form.logradouro}
              onChange={atualizarCampo}
              fullWidth
            />
            <TextField
              id="numero"
              name="numero"
              label="Número"
              value={form.numero}
              onChange={atualizarCampo}
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
            />
            <TextField
              id="cidade"
              name="cidade"
              label="Cidade"
              value={form.cidade}
              onChange={atualizarCampo}
            />
            <SelectField
              id="estado"
              name="estado"
              label="Estado (UF)"
              value={form.estado}
              options={OPCOES_ESTADO}
              onChange={atualizarCampo}
              placeholder="Selecione a UF"
            />
            <TextField
              id="cep"
              name="cep"
              label="CEP"
              value={form.cep}
              onChange={atualizarCampo}
              placeholder="00000-000"
            />
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-(--border) bg-(--bg) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--text-h)">
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

        <fieldset className="rounded-lg border border-(--border) bg-(--bg) px-5 pb-6 pt-4 shadow-(--shadow)">
          <legend className="px-2 text-sm font-semibold text-(--text-h)">
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
            />
            <TextField
              id="telefone"
              name="telefone"
              label="Telefone"
              type="tel"
              value={form.telefone}
              onChange={atualizarCampo}
            />
            <TextField
              id="site"
              name="site"
              label="Site"
              type="url"
              value={form.site}
              onChange={atualizarCampo}
              fullWidth
            />
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={status === "loading"}
          className="self-start rounded-md bg-(--accent) px-7 py-3 font-semibold text-white outline-none transition hover:brightness-95 focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg)"
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