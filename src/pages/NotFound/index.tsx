// src/pages/NotFound/index.jsx
export default function NotFound() {
    return(
        <main className={styles.container}>
            <h1>Página não encontrada</h1>
            <p>O endereço acessado não existe ou não está mais disponível.</p>
            <Link to="/">Voltar para a página inicial</Link>
            </main>
    )
}


