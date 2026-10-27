import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useSesion } from '../contexto/ContextoSesion.jsx'

// Barra de navegacion limpia, neutra y dinamica segun rol
export function Navbar() {
  const navegar = useNavigate()
  const { usuario, esAdministrador, cerrarSesion } = useSesion()

  function salir() {
    cerrarSesion()
    navegar('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg fixed-top barra-navegacion">
      <div className="container">
        <Link to="/home" className="navbar-brand d-flex align-items-center gap-2 fw-semibold">
          <span className="logo-insignia">
            <i className="bi bi-buildings"></i>
          </span>
          <span>Portal del Paraíso</span>
        </Link>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          {/* Navegacion para usuarios autenticados */}
          <NavLink
            to="/home"
            className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
          >
            <i className="bi bi-house"></i>
            <span>Inicio</span>
          </NavLink>

          <NavLink
            to="/catalogo"
            className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
          >
            <i className="bi bi-grid"></i>
            <span>Catálogo</span>
          </NavLink>

          <NavLink
            to="/reservas"
            className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
          >
            <i className="bi bi-calendar-plus"></i>
            <span>Reservar</span>
          </NavLink>

          <NavLink
            to="/mis-reservas"
            className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
          >
            <i className="bi bi-journal-check"></i>
            <span>Mis reservas</span>
          </NavLink>

          {/* Opciones exclusivas de Administrador */}
          {esAdministrador && (
            <>
              <NavLink
                to="/admin/nuevo-espacio"
                className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
              >
                <i className="bi bi-plus-circle"></i>
                <span>Nuevo espacio</span>
              </NavLink>
              <NavLink
                to="/admin/reservas-globales"
                className={({ isActive }) => `nav-enlace ${isActive ? 'activo' : ''}`}
              >
                <i className="bi bi-calendar-week"></i>
                <span>Gestión reservas</span>
              </NavLink>
            </>
          )}

          {usuario && (
            <span className="texto-usuario d-none d-lg-inline ms-1 me-1">
              <i className="bi bi-person-circle me-1"></i>
              {usuario.nombres} · <strong className="text-uppercase" style={{ fontSize: '0.75rem' }}>{usuario.rol}</strong>
            </span>
          )}

          <button
            type="button"
            onClick={salir}
            className="btn btn-claro btn-sm ms-1"
            title="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right me-1"></i>
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
