

export default function App() {
  const [termo, setTermo] = useState('')
  const [filtros, setFiltros] = useState<FiltrosLocais>(filtrosVazios)
  const [painelAberto, setPainelAberto] = useState(false)

  const resultados = filtrarLocais(locais, termo, filtros)
  const temFiltrosAtivos = termo.trim() !== '' || filtros.categoria !== '' || filtros.recursos.length > 0

  const alternarRecurso = (recurso: RecursoAcessibilidade) => {
    setFiltros((estadoAtual) => ({
      ...estadoAtual,
      recursos: estadoAtual.recursos.includes(recurso)
        ? estadoAtual.recursos.filter((item) => item !== recurso)
        : [...estadoAtual.recursos, recurso],
    }))
  }

  const limparFiltros = () => {
    setTermo('')
    setFiltros(filtrosVazios)
  }

  return (
    <div>App</div>
  )
}