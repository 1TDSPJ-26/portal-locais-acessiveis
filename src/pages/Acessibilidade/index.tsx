import "./styles.css";

const URL_FORMULARIO_BUG =
  "https://github.com/1TDSPJ-26/portal-locais-acessiveis/issues/new?template=bug.yml";

export default function Acessibilidade() {
  return (
    <div className="accessibility-page">
      <header className="accessibility-header">
        <p className="accessibility-eyebrow">
          Compromisso com a inclusão
        </p>

        <h1>Acessibilidade</h1>

        <p>
          Esta declaração descreve os recursos de acessibilidade do portal,
          o nível de conformidade almejado, as limitações conhecidas e o
          canal para relatar barreiras. Cada recurso listado já está
          implementado no portal.
        </p>
      </header>

      <div className="accessibility-content">
        <section aria-labelledby="recursos">
          <h2 id="recursos">Recursos de acessibilidade</h2>

          <p>O portal oferece atualmente os seguintes recursos:</p>

          <ul>
            <li>
              <strong>Link "Pular para o conteúdo"</strong>: o primeiro
              elemento da página, acessado com a tecla Tab, transfere o foco
              direto ao conteúdo principal.
            </li>
            <li>
              <strong>Controle de tamanho de fonte</strong>: três opções
              (normal, grande e maior) no painel de preferências.
            </li>
            <li>
              <strong>Alto contraste</strong>: alternador no painel de
              preferências de exibição.
            </li>
            <li>
              <strong>Modo escuro automático</strong>: acompanha a preferência
              do sistema, com contraste mínimo de 4,5:1 entre texto e fundo.
            </li>
            <li>
              <strong>Foco visível</strong>: indicador padronizado no elemento
              focado em toda a navegação por teclado.
            </li>
            <li>
              <strong>Menu do cabeçalho operável por teclado</strong>,
              inclusive em telas pequenas.
            </li>
            <li>
              <strong>Busca de locais</strong> que ignora caixa e acentuação,
              com a quantidade de resultados anunciada para leitores de tela.
            </li>
            <li>
              <strong>Mensagens de erro do cadastro</strong> associadas aos
              campos e anunciadas por leitores de tela.
            </li>
          </ul>
        </section>

        <section aria-labelledby="navegacao">
          <h2 id="navegacao">Navegação por teclado</h2>

          <ol>
            <li>
              <kbd>Tab</kbd> avança para o próximo elemento interativo;
              <kbd>Shift</kbd> + <kbd>Tab</kbd> volta ao anterior.
            </li>
            <li>
              <kbd>Enter</kbd> ativa links e botões; <kbd>Espaço</kbd> ativa
              botões e alterna caixas de seleção.
            </li>
            <li>
              O link "Pular para o conteúdo" é o primeiro elemento em cada
              página: pressione <kbd>Tab</kbd> uma vez e <kbd>Enter</kbd> para
              ir direto ao conteúdo.
            </li>
            <li>
              Busca, filtros, formulário de cadastro e menu do cabeçalho são
              operáveis apenas com teclado.
            </li>
          </ol>
        </section>

        <section aria-labelledby="conformidade">
          <h2 id="conformidade">Nível de conformidade</h2>

          <p>
            O portal almeja o <strong>nível AA</strong> das WCAG 2.2, em
            conformidade parcial: critérios AA já adotados incluem o contraste
            mínimo de 4,5:1 entre texto e fundo. A conformidade plena ainda
            não está declarada; as pendências conhecidas estão listadas na
            seção de limitações.
          </p>
        </section>

        <section aria-labelledby="limitacoes">
          <h2 id="limitacoes">Limitações conhecidas</h2>

          <ul>
            <li>
              O foco não é movido para o conteúdo principal nas trocas de
              rota (Issue #79).
            </li>
            <li>
              O ciclo de foco e o fechamento do menu mobile ainda apresentam
              defeito (Issue #81).
            </li>
            <li>
              O título do documento não muda conforme a rota visitada
              (Issue #84).
            </li>
            <li>
              O detalhe do local não possui trilha de navegação
              (Issue #78).
            </li>
            <li>
              Os locais cadastrados ficam apenas no navegador de cada pessoa:
              não há sincronização entre dispositivos.
            </li>
          </ul>
        </section>

        <section aria-labelledby="contato">
          <h2 id="contato">Reportar barreiras</h2>

          <p>
            Encontrou uma barreira de acessibilidade ou tem uma sugestão de
            melhoria? Abra uma Issue no repositório usando o formulário de
            bug.
          </p>

          <p>
            <strong>Canal para relatar barreiras:</strong>{" "}
            <a
              href={URL_FORMULARIO_BUG}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir Issue com o formulário de bug
            </a>
            .
          </p>
        </section>

        <p>Última revisão desta declaração: 6 de outubro de 2026.</p>
      </div>
    </div>
  );
}