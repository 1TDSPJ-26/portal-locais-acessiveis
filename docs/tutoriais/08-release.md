# Tutorial 8 — Release do CP

## Objetivo

Transformar o conteúdo aprovado de `develop` em uma versão estável publicada em `main`.

Release significa a versão oficialmente liberada e identificada do projeto.

## Responsabilidades

- professor: autoriza a publicação final;
- Tech Lead: prepara a branch e o Pull Request de release;
- QA: executa regressão e emite decisão go/no-go;
- DEV: corrige apenas defeitos autorizados durante o congelamento.

**Go/no-go** significa decisão de publicar ou não publicar a versão.

## Passo 1 — iniciar o congelamento

Na data definida:

1. não adicione funcionalidade nova;
2. confirme que Issues previstas estão aprovadas ou formalmente replanejadas;
3. registre demandas removidas da release;
4. confira bloqueios e defeitos.

## Passo 2 — criar a branch de release

O Tech Lead executa:

```bash
git switch develop
git pull origin develop
git flow release start cp1
git flow release publish cp1
```

Troque `cp1` por `cp2` ou `cp3` conforme o ciclo. O Git Flow cria `release/cp1` a partir de `develop` e a publica no GitHub.

Não execute `git flow release finish`: a integração será feita pelo Pull Request protegido.

## Passo 3 — executar regressão

O QA testa na branch ou no ambiente de release indicado pelo professor:

- rotas principais;
- funcionalidades do CP;
- integrações;
- estados de erro, vazio e carregamento;
- teclado e foco;
- responsividade;
- build;
- riscos corrigidos desde a última aprovação.

## Passo 4 — tratar defeitos

Durante o congelamento:

- defeito crítico bloqueia a release;
- defeito alto bloqueia a demanda relacionada;
- defeito médio exige decisão registrada;
- defeito baixo pode ser replanejado.

Correções devem possuir Issue, branch, Pull Request, CI e reteste. Não corrija diretamente na branch de release sem autorização e rastreabilidade.

## Passo 5 — emitir go/no-go

O QA registra:

- versão testada;
- cenários executados;
- defeitos abertos;
- riscos aceitos;
- decisão `GO` ou `NO-GO`;
- evidências.

## Passo 6 — abrir Pull Request para main

O Tech Lead abre:

```text
base: main
compare: release/cp1
```

O Pull Request deve conter:

- Milestone do CP;
- resumo da versão;
- Issues entregues;
- Issues replanejadas;
- resultado da regressão;
- decisão do QA;
- link ou identificação do ambiente testado;
- riscos conhecidos;
- autorização solicitada ao professor.

## Passo 7 — aprovar e publicar

1. aguarde CI verde;
2. QA aprova a release;
3. professor autoriza e aprova;
4. Tech Lead realiza merge em `main`;
5. professor executa ou libera a publicação controlada do conteúdo de `main`;
6. equipe valida a URL de produção.

## Passo 8 — criar a GitHub Release

1. abra **Releases**.
2. clique em **Draft a new release**.
3. crie a tag, por exemplo:

```text
cp1-2026-2
```

4. selecione `main` como alvo;
5. use o título `CP1 — Fundação e MVP de leitura`;
6. utilize `docs/modelo-release.md`;
7. publique a Release.

## Passo 9 — sincronizar develop

Depois da publicação, abra outro Pull Request:

```text
base: develop
compare: main
```

Depois do CI e das aprovações, faça o merge. Isso leva a versão publicada e possíveis ajustes da release de volta para `develop`, evitando divergência com o trabalho futuro.

Quando essa sincronização terminar, o Tech Lead pode limpar a branch local:

```bash
git switch develop
git pull origin develop
git branch -d release/cp1
git fetch --prune
```

## Checklist final

- [ ] Feature freeze cumprido.
- [ ] Regressão registrada.
- [ ] QA emitiu GO.
- [ ] CI verde.
- [ ] Professor autorizou.
- [ ] Merge em `main` concluído.
- [ ] Produção validada.
- [ ] GitHub Release publicada.
- [ ] `develop` sincronizada.
