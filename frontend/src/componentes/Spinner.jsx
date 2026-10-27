// Indicador de carga reutilizable
export function Spinner({ texto = 'Cargando...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className="spinner-border spinner-marca mb-3" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
      <span className="text-muted">{texto}</span>
    </div>
  )
}
