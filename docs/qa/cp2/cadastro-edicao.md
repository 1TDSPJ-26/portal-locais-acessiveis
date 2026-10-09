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

