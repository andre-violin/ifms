import { useState } from 'react'

export default function FormUsuario({ usuario, onSalvo, onCancelar }) {
    const [nome, setNome] = useState(usuario?.name ?? usuario?.nome ?? '')
    const [email, setEmail] = useState(usuario?.email ?? '')
    const [enviando, setEnviando] = useState(false)
    const [erro, setErro] = useState(null)
    const [criado, setCriado] = useState(null)

    async function enviar(evento) {
        evento.preventDefault()
        setEnviando(true)
        setErro(null)
        setCriado(null)

        const method = usuario ? 'PUT' : 'POST'
        const url = usuario
            ? `https://jsonplaceholder.typicode.com/users/${usuario.id}`
            : 'https://jsonplaceholder.typicode.com/users'

        try {
            const resp = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nome.trim(), email: email.trim() })
            })
            if (!resp.ok)
                throw new Error(`HTTP ${resp.status}`)
            const data = await resp.json()
            setCriado(data)
            onSalvo?.(data)
            if (!usuario) {
                setNome('')
                setEmail('')
            }
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <form onSubmit={enviar} className="user-form">
            <label htmlFor="nome">Nome completo</label>
            <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Lucas Bispo"
                autoComplete="name"
                required
            />

            <label htmlFor="email">E-mail</label>
            <input
                id='email'
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lucas@email.com"
                autoComplete="email"
                required
            />

            <div className="form-actions">
                <button type="submit" disabled={enviando}>{enviando ? 'Salvando...' : usuario ? 'Salvar alterações' : 'Cadastrar'}</button>
                {usuario && <button type="button" className="button-secondary" onClick={onCancelar} disabled={enviando}>Cancelar</button>}
            </div>
            {erro && <p className="feedback feedback-error" role="alert">Erro: {erro}</p>}
            {criado && <p className="feedback feedback-success" role="status">Usuário salvo com sucesso.</p>}

        </form>
    )
}