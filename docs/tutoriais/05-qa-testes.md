# Tutorial 5 — QA: plano, execução, defeitos e decisão

## Objetivo

Verificar critérios de aceite com evidências e impedir que uma demanda defeituosa avance sem registro.

QA significa **Quality Assurance**, ou **Garantia da Qualidade**.

## Regra de independência

O QA não testa a própria implementação e não realiza merge. Seu papel é planejar, executar, registrar e decidir com base nos critérios.

## Passo 1 — preparar o teste

Antes de executar, confirme:

- Issue refinada;
- critérios de aceite;
- Pull Request relacionado;
- revisão técnica concluída;
- CI verde;
- ambiente de teste indicado pelo professor disponível;
- dados de teste necessários.

Se faltar uma dessas condições, registre `Bloqueado`; não registre `Reprovado` por ausência de ambiente.

## Passo 2 — criar a Issue de teste

1. Abra **Issues > New issue**.
2. Escolha o formulário de teste.
3. Relacione a Issue funcional e o Pull Request.
4. Descreva ambiente, dados e cenários.
5. Defina o resultado esperado de cada cenário.

## Passo 3 — executar no ambiente de teste

Abra o ambiente indicado pelo professor e teste:

1. caminho principal;
2. entrada inválida;
3. resposta vazia;
4. falha da API, quando possível;
5. carregamento;
6. navegação por teclado;
7. foco visível;
8. rótulos e mensagens;
9. tamanhos de tela previstos;
10. critérios específicos da Issue.

Não aprove apenas observando uma captura de tela. Execute a funcionalidade.

## Passo 4 — registrar evidências

Para cada cenário, informe:

- ação realizada;
- resultado esperado;
- resultado observado;
- status: passou ou falhou;
- evidência: imagem, vídeo curto, log ou resposta da API.

Remova dados pessoais e credenciais das evidências.

## Passo 5 — registrar um defeito

Quando encontrar um defeito:

1. abra uma Issue com o modelo de bug;
2. informe os passos para reproduzir;
3. registre esperado e obtido;
4. informe o ambiente e a versão testada;
5. anexe evidência;
6. classifique a severidade;
7. relacione a Issue original e o Pull Request;
8. atribua ao responsável correto.

Severidades:

| Severidade | Significado | Efeito |
|---|---|---|
| Crítica | segurança, perda de dados, indisponibilidade ou fluxo essencial impossível | bloqueia release |
| Alta | critério importante não funciona | bloqueia demanda |
| Média | impacto parcial ou alternativa possível | correção planejada |
| Baixa | detalhe visual ou textual de baixo impacto | não bloqueia isoladamente |

## Passo 6 — tomar a decisão

Use uma das decisões:

### Aprovado

Todos os critérios foram atendidos e não existe falha relevante.

1. aprove o Pull Request;
2. registre resumo dos testes;
3. mova a Issue para `Aprovada`.

### Aprovado com ressalva

Existe limitação pequena, registrada e aceita, que não impede o objetivo.

1. registre a ressalva e a Issue de correção;
2. informe por que não bloqueia;
3. aprove o Pull Request;
4. mova para `Aprovada`.

### Reprovado

Um critério relevante falhou.

1. use **Request changes** no Pull Request;
2. relacione os defeitos;
3. mova para `Correção solicitada`;
4. aguarde novo push;
5. execute o reteste.

### Bloqueado

O teste não pode ser concluído por ausência de ambiente, dependência ou dado necessário.

1. não aprove;
2. não reprove automaticamente;
3. registre o impedimento;
4. mova para `Bloqueada`;
5. mencione Tech Lead e professor quando necessário.

## Passo 7 — executar o reteste

Quando houver correção:

1. confirme novo commit;
2. aguarde CI verde;
3. use a nova versão do ambiente indicado;
4. repita o cenário que falhou;
5. execute regressão nos caminhos relacionados;
6. registre o novo resultado;
7. somente então altere a decisão.

## Regra de justiça

Reprovar corretamente uma funcionalidade não prejudica o QA. Uma reprovação com evidência protege o projeto e demonstra cumprimento da responsabilidade.
