export default function ListaUsuarios({ usuarios, onEditar, onExcluir, excluindoId }) {
	return (
		<ul className="user-list">
			{usuarios.map((usuario) => (
				<li key={usuario.id} className="user-row">
					<div>
						<strong>{usuario.id} - {usuario.name}</strong>
						<span>{usuario.email}</span>
					</div>
					<div className="row-actions">
						<button type="button" className="button-secondary" onClick={() => onEditar(usuario)} disabled={excluindoId !== null}>Editar</button>
						<button type="button" className="button-danger" onClick={() => onExcluir(usuario.id)} disabled={excluindoId !== null}>
							{excluindoId === usuario.id ? 'Excluindo...' : 'Excluir'}
						</button>
					</div>
				</li>
			))}
		</ul>
	)
}