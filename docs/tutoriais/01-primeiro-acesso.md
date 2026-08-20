# Tutorial 1 — primeiro acesso, clone e execução

## Objetivo

Ao final, você terá o repositório da sua turma no computador, a branch correta selecionada e o projeto executando.

## Antes de começar

Você precisa de:

- conta no GitHub com e-mail verificado;
- convite da organização aceito;
- Git instalado;
- extensão `git flow` instalada;
- Node.js na versão indicada pelo professor;
- Visual Studio Code;
- acesso ao repositório da sua turma.

## Passo 1 — aceitar o convite

1. Entre no GitHub.
2. Abra suas notificações ou o e-mail do convite.
3. Clique em **Join** ou **Accept invitation**.
4. Confirme que o repositório da turma aparece.

Se aparecer erro 404 no repositório, confirme se o convite foi aceito e se você entrou com a conta correta.

## Passo 2 — conferir Git e Node.js

Abra o terminal e execute:

```bash
git --version
git flow version
node --version
npm --version
```

Os quatro comandos precisam apresentar uma versão. Se algum não for reconhecido, pare e faça a instalação antes de continuar.

## Passo 3 — configurar sua autoria

Use seu nome real e o e-mail associado ao GitHub:

```bash
git config --global user.name "Seu Nome Completo"
git config --global user.email "seu-email@exemplo.com"
```

Confira:

```bash
git config --global user.name
git config --global user.email
```

Não use o nome ou o e-mail de outro integrante. A autoria dos commits é uma evidência individual.

## Passo 4 — copiar a URL do repositório

1. Abra o repositório da sua turma.
2. Clique no botão **Code**.
3. Selecione **HTTPS**.
4. Copie a URL.

## Passo 5 — clonar

No terminal, entre na pasta em que guarda seus projetos e execute:

```bash
git clone URL_DO_REPOSITORIO
cd NOME_DO_REPOSITORIO
```

Exemplo:

```bash
git clone https://github.com/1TDSPH-26/portal-locais-acessiveis.git
cd portal-locais-acessiveis
```

## Passo 6 — confirmar a branch

Execute:

```bash
git branch --show-current
```

O resultado esperado é:

```text
develop
```

Se aparecer outra branch:

```bash
git switch develop
git pull origin develop
```

## Passo 7 — inicializar o Git Flow neste clone

Execute:

```bash
git flow init
```

Quando o comando perguntar:

1. confirme `main` como branch de produção;
2. confirme `develop` como branch de desenvolvimento;
3. pressione `Enter` para aceitar os prefixos padrão.

Essa configuração é local e precisa ser realizada uma única vez em cada clone do repositório.

## Passo 8 — instalar dependências

Execute:

```bash
npm ci
```

`npm ci` instala exatamente as versões registradas no `package-lock.json`.

## Passo 9 — executar o projeto

Execute:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente:

```text
http://localhost:5173
```

## Passo 10 — validar o build

Interrompa o servidor com `Ctrl + C` e execute:

```bash
npm run lint
npm run build
```

Não comece uma demanda se o projeto-base já estiver apresentando erro. Registre o problema na Issue e avise o Tech Lead.

## Checklist

- [ ] Convite aceito.
- [ ] Repositório correto clonado.
- [ ] Autoria do Git configurada.
- [ ] Branch atual é `develop`.
- [ ] Git Flow inicializado neste clone.
- [ ] `npm ci` concluído.
- [ ] Aplicação abriu no navegador.
- [ ] Lint e build executados.
