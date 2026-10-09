# Relatório de Garantia de Qualidade (QA) - CP2: Cadastro, Edição e Exclusão

**Responsável:** João Victor de Jesus Bernardo  
**RM:** 568729  
**GitHub:** @joaovjbernardo  
**Papel:** QA  
**Data da execução:** 07/10/2026  

---

## 1. Visão Geral

Este documento apresenta as evidências de testes manuais, acessibilidade e automação cobrindo o fluxo de cadastro, edição, exclusão e validação/sanitização de locais acessíveis.

---

## 2. Escopo dos Testes Executados

### A. Fluxo de Cadastro (#72 e #86)
- **Dados Válidos:** Confirmação de cadastro apresentada com sucesso.
- **Campos Obrigatórios:** Verificação de mensagens de erro individuais quando nome, endereço ou categoria estão vazios.
- **Validação de Formatos:** Teste com e-mail inválido (`email.invalido`), telefone incompleto (`1234`), CEP fora do padrão (`00000-00`) e URL incorreta.
- **Locais Duplicados:** Tentativa de cadastro de local com mesmo nome e endereço de um existente.
- **Sanitização de Dados:** Entrada com espaços no início/fim e caracteres não imprimíveis (`\u0000`, `\u0007`) para validar a remoção antes do salvamento.

### B. Fluxo de Edição (#73)
- **Alteração Concluída:** Edição bem-sucedida de nome, telefone e descrição de local cadastrado.
- **Erro na Edição:** Tentativa de salvar alteração apagando o campo obrigatório "Nome".
- **Cancelamento:** Acionamento do botão cancelar, garantindo que os dados originais foram mantidos sem alterações.

### C. Fluxo de Exclusão (#74)
- **Confirmação:** Exclusão confirmada na modal remove o item da listagem.
- **Cancelamento:** Acionamento do botão "Cancelar" fecha o diálogo sem apagar o registro.
- **Navegação via Teclado:** Pressionar a tecla `Escape` enquanto o modal de confirmação está aberto fecha o diálogo de forma segura.

---

## 3. Validação de Acessibilidade

- **Aviso Sonoro (Screen Reader):** Verificado com leitor de tela (NVDA / VoiceOver). As mensagens de erro estão associadas ao container com a propriedade `role="alert"` e `aria-live="assertive"`, garantindo anúncio imediato no momento em que são disparadas.
- **Sinalização Não Exclusiva por Cor:** As mensagens de erro apresentam texto explicativo e ícone indicativo ao lado do campo afetado.
- **Contraste e Estilo CSS:** Verificação efetuada nos modos Claro, Escuro e Alto Contraste. Garantido que não há elementos ocultados involuntariamente por variáveis CSS indefinidas no `:root`.

---

## 4. Testes Automatizados

O módulo de validações (`src/utils/ValidarCadastro.ts`) foi automatizado na suíte de testes utilizando o executor nativo `node:test`.

**Resultado da execução (`npm test`):**
```text
▶ Suíte de Testes Automatizados - Validação e Sanitização de Locais (#86)
  ▶ Validação de E-mail (validarEmail)
    ✔ deve retornar true para e-mails válidos (0.85ms)
    ✔ deve retornar false para e-mails sem @ ou sem domínio completo (0.32ms)
  ▶ Validação de CEP (validarCep)
    ✔ deve aceitar CEPs válidos com ou sem hífen (8 dígitos) (0.28ms)
    ✔ deve rejeitar CEPs com quantidade incorreta de dígitos (0.21ms)
  ▶ Validação de Telefone (validarTelefone)
    ✔ deve validar telefones fixos e móveis com DDD (0.25ms)
    ✔ deve rejeitar números incompletos ou formatos inválidos (0.19ms)
  ▶ Sanitização de Dados (sanitizarTexto)
    ✔ deve remover espaços extras nas extremidades e caracteres de controle (0.35ms)