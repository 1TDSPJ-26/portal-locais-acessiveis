# Tutorial 6 — CI, publicação e CD

## O que significam

- **CI — Continuous Integration, ou Integração Contínua:** o GitHub verifica automaticamente se a alteração instala, passa pelo lint, gera build e executa os testes disponíveis.
- **CD — Continuous Deployment, ou Implantação Contínua:** um ambiente publica automaticamente uma versão depois de uma alteração autorizada.
- **Deploy:** publicação da aplicação em um ambiente acessível pela internet.
- **Preview:** publicação temporária utilizada para teste, quando estiver disponível.

Nesta turma, o CI é automático. A publicação será controlada pelo professor enquanto o CD seguro não estiver habilitado.

Não conclua que um Pull Request sempre terá Preview da Vercel. Utilize apenas o ambiente informado oficialmente na Issue ou pelo professor.

## Parte A — interpretar o CI

### Resultado amarelo

O workflow ainda está em execução. Aguarde e não solicite aprovação final.

### Resultado verde

Todas as etapas automáticas terminaram com sucesso. Isso não substitui a revisão técnica nem o teste do QA.

### Resultado vermelho

Uma etapa falhou. O Pull Request não está pronto para merge.

## Passo a passo para encontrar o erro

1. Abra o Pull Request.
2. Localize **Checks** ou a área de verificações.
3. Clique em **Details** ao lado de `lint-build-test`.
4. Abra o job que falhou.
5. Expanda a primeira etapa vermelha.
6. Leia a mensagem de erro.

Erros comuns:

| Etapa | Causa provável | Ação |
|---|---|---|
| `npm ci` | `package-lock.json` ausente ou incompatível | executar `npm install`, conferir os arquivos e versionar o lock |
| lint | variável não usada, regra quebrada ou importação incorreta | executar `npm run lint` localmente e corrigir |
| build | erro de TypeScript, importação ou configuração | executar `npm run build` localmente |
| test | comportamento esperado não foi atendido | executar os testes e corrigir a implementação |

## Corrigir o CI

Na mesma branch:

```bash
npm ci
npm run lint
npm run build
npm run test --if-present
```

Depois:

```bash
git add ARQUIVOS_CORRIGIDOS
git commit -m "fix: corrige falha identificada no CI"
git push
```

O push inicia uma nova execução automaticamente. Não abra outro Pull Request.

Use **Re-run jobs** apenas quando a falha foi externa ou temporária. Reexecutar não corrige código defeituoso.

## Parte B — ambiente de teste

Quando o professor disponibilizar uma URL de teste:

1. confirme qual branch ou commit foi publicado;
2. confira se a URL está registrada na Issue ou no Pull Request;
3. abra o ambiente;
4. teste a funcionalidade;
5. registre a versão e o horário do teste;
6. não aprove código diferente daquele que o CI analisou.

Quando não existir ambiente publicado, o QA registra **Bloqueado por ausência de ambiente**, e não **Reprovado**.

## Parte C — publicação de produção

`main` representa a versão autorizada para produção.

A publicação ocorre somente depois de:

1. CI verde;
2. regressão do QA;
3. decisão `GO` do QA;
4. aprovação do professor;
5. merge da Release em `main`.

`GO` significa autorização técnica para publicar. `NO-GO` significa que a publicação está bloqueada.

Enquanto o CD automático não estiver habilitado, o professor executará a publicação controlada a partir de `main`.

## Relação entre as verificações

| Verificação | O que prova | O que não prova |
|---|---|---|
| lint | regras estáticas de código | funcionamento da tela |
| build | TypeScript e empacotamento concluíram | critérios atendidos |
| testes automáticos | cenários programados passaram | todos os cenários possíveis |
| ambiente publicado | a aplicação pode ser acessada | qualidade funcional |
| revisão técnica | o código foi analisado | experiência completa do usuário |
| QA | critérios foram executados | ausência absoluta de defeitos |

## Regra de segurança

Variáveis iniciadas por `VITE_` são enviadas ao navegador. Nunca coloque senha, token privado ou segredo nelas.

Arquivos `.env`, a pasta `.vercel` e tokens de publicação não devem ser enviados ao GitHub.
