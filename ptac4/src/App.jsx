import { useEffect, useState } from 'react'
import './App.css'
import ListaUsuarios from './components/ListaUsuarios'
import FormUsuario from './components/FormUsuario'

const API_URL = 'https://jsonplaceholder.typicode.com/users'

export default function App() {
    const [usuarios, setUsuarios] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState(null)
    const [editando, setEditando] = useState(null)
    const [excluindoId, setExcluindoId] = useState(null)

    useEffect(() => {
        const controle = new AbortController()  // cria um controle
        const signal = controle.signal          // o signal vigia a requisição

        async function buscar() {
            try {
                setCarregando(true)
                setErro(null)
                const resp = await fetch(API_URL, { signal })
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
                const data = await resp.json()
                setUsuarios(data)
            } catch (e) {
                if (e.name !== 'AbortError') {
                    // Ignora AbortError: é quando nós mesmos cancelamos
                    setErro(e.message)
                }
            } finally {
                setCarregando(false)
            }
        }

        buscar()

        // Cleanup: ao desmontar, cancela a requisição em andamento
        return () => controle.abort()
    }, [])

    async function excluirUsuario(id) {
        const resp = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    }

    async function tentarExcluir(id) {
        const usuariosAnteriores = usuarios
        setExcluindoId(id)
        setErro(null)
        setUsuarios(usuariosAnteriores.filter(u => u.id !== id))
        try {
            await excluirUsuario(id)
        } catch (e) {
            setUsuarios(usuariosAnteriores)
            setErro(e.message)
        } finally {
            setExcluindoId(null)
        }
    }

    function editarUsuario(usuario) {
        setEditando(usuario)
    }

    function usuarioSalvo(usuarioSalvo) {
        setUsuarios((atuais) =>
            usuarioSalvo.id
                ? atuais.some((u) => u.id === usuarioSalvo.id)
                    ? atuais.map((u) => u.id === usuarioSalvo.id ? usuarioSalvo : u)
                    : [...atuais, usuarioSalvo]
                : atuais
        )
        setEditando(null)
    }

    return (
        <div className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Painel de administração</p>
                    <h1>Usuários</h1>
                    <p className="subtitle">Cadastre, edite e acompanhe os usuários da aplicação.</p>
                </div>
                <span className="counter" aria-label={`${usuarios.length} usuários cadastrados`}>
                    {usuarios.length} {usuarios.length === 1 ? 'usuário' : 'usuários'}
                </span>
            </header>

            <main className="content-grid">
                <section className="form-panel" aria-labelledby="form-title">
                    <h2 id="form-title">{editando ? 'Editar usuário' : 'Novo usuário'}</h2>
                    <FormUsuario key={editando?.id ?? 'novo'} usuario={editando} onSalvo={usuarioSalvo} onCancelar={() => setEditando(null)} />
                </section>

                <section className="list-panel" aria-labelledby="list-title">
                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">Diretório</p>
                            <h2 id="list-title">Usuários cadastrados</h2>
                        </div>
                        {carregando && <span className="status">Carregando...</span>}
                    </div>
                    {erro && <p className="feedback feedback-error" role="alert">Erro: {erro}</p>}
                    {!carregando && !erro && usuarios.length === 0 && <p className="empty-state">Nenhum usuário encontrado.</p>}
                    <ListaUsuarios usuarios={usuarios} onExcluir={tentarExcluir} onEditar={editarUsuario} excluindoId={excluindoId} />
                </section>
            </main>
        </div>
    )
}