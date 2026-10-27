import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../contexto/ContextoSesion.jsx'

// Barra de navegacion dinamica: cambia segun el rol del usuario
export function Navbar() {
  const navegar = useNavigate()
  const { usuario, esAdministrador, cerrarSesion } = useSesion()

  function salir() {
    cerrarSesion()
    navegar('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top barra-navegacion">
      <div className="container">
        <Link to="/catalogo" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
          <span className="logo-insignia"><i className="bi bi-buildings-fill"></i></span>
          Portal del Paraíso
        </Link>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="texto-usuario d-none d-md-inline me-2">
            <i className="bi bi-person-circle me-1"></i>{usuario.nombres} · {usuario.rol}
          </span>

          {/* Opciones para todos los usuarios autenticados */}
          <Link to="/catalogo" className="btn btn-fantasma btn-sm">
            <i className="bi bi-grid me-1"></i>Catálogo
          </Link>
          <Link to="/reservas" className="btn btn-fantasma btn-sm">
            <i className="bi bi-calendar-plus me-1"></i>Reservar
          </Link>
          <Link to="/mis-reservas" className="btn btn-fantasma btn-sm">
            <i className="bi bi-journal-check me-1"></i>Mis reservas
          </Link>

          {/* Solo el administrador ve estas opciones */}
          {esAdministrador && (
            <>
              <Link to="/admin/nuevo-espacio" className="btn btn-fantasma btn-sm">
                <i className="bi bi-door-open me-1"></i>Nuevo espacio
              </Link>
              <Link to="/admin/reservas-globales" className="btn btn-fantasma btn-sm">
                <i className="bi bi-calendar-week me-1"></i>Reservas globales
              </Link>
            </>
          )}

          <button type="button" onClick={salir} className="btn btn-claro btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i>Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
