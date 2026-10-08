# Relatório do QA

## Identificação

- Turma: 1TDSPJ
- Squad: 4
- CP: 2
- QA responsável: Eduardo Pizzoli Junior
- Data e horário: 7/10/26 - 20:03
- Issue testada: [QA] Executar o ciclo de testes de rotas e navegação por teclado #61

## Escopo do teste

Nesta issue, está sendo testada a a navegação exclusivamente por teclado através do site, utilizando teclas como Tab, Shift+Tab, Espaço, Esc e Enter. Além disso, será implementado um novo teste em tests/.

Navegador: Google Chrome, Windows 11, resolução 1920x1080

## Testes

### Navegação através do teclado

*Resultado:* Bem-sucedida. 

*Descrição:* Foi possível navegar através do site por meio do teclado, acessar links e acessar caixas de texto e de seleção de opções nas páginas de cadastrar e editar. O foco estava sempre visível, o link "Pular para o conteúdo" funcionou corretamente e o menu mobile era navegável.

### Teste de rotas

*Resultado:* Bem-sucedido. 

*Descrição:* Todas as rotas eram acessáveis através da barra de pesquisa e resultavam no endereço correto. O endereço inexistente e identificador de local inexistente resultavam em páginas "Endereço não encontrado" e "Local não encontrado", respectivamente.

*Rotas testadas:*
/
/locais
/locais/id
/locais/id/editar
/cadastrar
/sobre
/acessibilidade
endereço inexistente
id inexistente

Todas as evidências podem ser encontradas no PR referente a esta issue.


## Defeitos encontrados

| Issue | Gravidade | Resumo | Situação |
|---|---|---|---|
| 123 | Baixa | O título do documento não muda ao navegar entre as rotas, permanecendo sempre como "portal-acessivel-template" | Aberta |

## Decisão

- [ X ] Aprovado
- [ ] Aprovado com ressalva
- [ ] Reprovado
- [ ] Bloqueado

## Conclusão

Durante todos os testes realizados, pôde-se notar que, mesmo com o pequeno bug na exibição do nome do documento, o site pode funcionar normalmente, com navegação funcional com o teclado, acesso de rotas sem obstáculos, foco visível e menu mobile funcional.

Os testes foram realizados de forma manual.

Assim, conclui-se que o site foi testado e aprovado.