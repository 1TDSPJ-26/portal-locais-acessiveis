# Configuração do repositório da organização

## 0. Cenário adotado

- Uma organização existente para cada turma.
- Alunos já cadastrados como membros da organização.
- Um repositório público por organização.
- Vercel Hobby sem conexão Git direta; publicação controlada pela Vercel CLI.
- Equipes `alunos`, `professores`, `tech-leads` e `qas` em cada organização.
- DEVs recebem `Write` pela equipe `alunos`, somente no repositório do projeto.

## 1. Copiar os arquivos

Coloque o conteúdo deste pacote na raiz do repositório. Isso pode ser feito antes da instalação do Vite; o workflow aguardará a existência de `package.json` e `package-lock.json`.

## 2. Criar as labels

Utilize `docs/configuracao-labels.md`.

As labels citadas nos formulários precisam existir no repositório.

## 3. Ajustar CODEOWNERS

Abra `.github/CODEOWNERS` e substitua:

```text
ORGANIZACAO
```

pelo nome real da organização. As equipes devem se chamar `professores`, `tech-leads` e `qas`.

Confirme também se as pastas representam a estrutura real do projeto.

## 4. Criar branches

Crie:

```text
main
develop
```

Defina `develop` como branch padrão. Isso faz o clone inicial e os novos Pull Requests apontarem para a branch de integração. A branch `main` continua sendo a fonte da publicação de produção.

Em cada clone, confira e inicialize a extensão Git Flow:

```bash
git flow version
git flow init
```

No `git flow init`, confirme `main` para produção, `develop` para desenvolvimento e aceite os prefixos padrão.

## 5. Configurar Ruleset de develop

Execute o workflow de CI pelo menos uma vez antes de procurar o status `lint-build-test` na lista de checks obrigatórios.

- exigir Pull Request;
- exigir duas aprovações;
- exigir revisão de proprietários definidos no `CODEOWNERS`;
- conferir manualmente se houve uma aprovação do Tech Lead e uma do QA;
- descartar aprovações após alterações relevantes;
- exigir resolução das conversas;
- exigir o status `lint-build-test`;
- não exigir que toda branch esteja sempre atualizada antes do merge, pois a turma possui muitos Pull Requests simultâneos;
- bloquear exclusão;
- bloquear `force push`;
- impedir commits diretos.

## 6. Configurar Ruleset de main

- exigir Pull Request;
- exigir duas aprovações;
- conferir manualmente se houve uma aprovação do professor e uma do QA;
- exigir o status `lint-build-test`;
- exigir resolução das conversas;
- bloquear exclusão;
- bloquear `force push`;
- utilizar somente para Releases autorizadas.

Não coloque Tech Leads, QAs ou DEVs na lista de bypass. Se o professor precisar de bypass administrativo em uma emergência, o motivo deve ser registrado no Pull Request.

## 7. Criar Milestones

| Milestone | Data limite |
|---|---|
| CP1 | 11/09/2026 |
| CP2 | 02/10/2026 |
| CP3 | 23/10/2026 |

## 8. Criar o Project

Siga `docs/configuracao-project.md`.

As squads devem ser registradas no campo `Squad` do Project. Não é necessário criar cinco equipes extras por turma apenas para representar as squads.

## 9. Conferir package.json

Quando `package.json` e `package-lock.json` existirem, o workflow executa:

```bash
npm ci
npm run lint --if-present
npm run build
npm run test --if-present
```

O `package-lock.json` precisa estar versionado para que `npm ci` funcione.

## 10. Configurar variáveis

Copie `.env.example` para um arquivo local apropriado e preencha somente valores não secretos destinados ao cliente.

Variáveis iniciadas por `VITE_` ficam disponíveis no código enviado ao navegador. Não utilize esse prefixo para senhas ou chaves privadas.

## 11. Testar antes de duplicar

No repositório-modelo:

1. abra uma Issue de funcionalidade;
2. preencha os campos;
3. associe ao Project e ao Milestone;
4. crie a branch com `git flow feature start NUMERO-descricao`;
5. publique-a com `git flow feature publish NUMERO-descricao` e abra Pull Request para `develop`;
6. confirme a execução do CI;
7. solicite duas revisões;
8. execute um ciclo de teste do QA;
9. realize o merge;
10. confirme o encerramento da Issue.

Como `develop` é a branch padrão, a expressão `Closes #NUMERO` no Pull Request encerra a Issue quando o merge em `develop` é realizado.

Somente depois desse teste replique a configuração nas demais organizações das turmas.

## 12. Conferência final

- [ ] Formulários de Issue aparecem corretamente.
- [ ] Issues em branco estão desabilitadas.
- [ ] Template de Pull Request é carregado.
- [ ] CODEOWNERS solicita as equipes corretas.
- [ ] CI executa lint, build e testes disponíveis.
- [ ] `main` e `develop` não aceitam commit direto.
- [ ] `develop` está definida como branch padrão.
- [ ] Milestones possuem as datas corretas.
- [ ] Project recebe as Issues.
- [ ] Notas e RMs não aparecem no repositório.
- [ ] A publicação controlada utiliza somente o conteúdo aprovado de `main`.
- [ ] Uma rota interna, como `/locais/1`, abre diretamente na Vercel sem erro 404.
