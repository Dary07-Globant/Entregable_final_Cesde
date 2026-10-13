import { Link, useNavigate } from 'react-router-dom'
import { useSesion } from '../contexto/ContextoSesion.jsx'

const IMAGEN_PORTADA = 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=1800&q=80'

const zonas = [
  {
    nombre: 'Piscina',
    descripcion: 'Zona húmeda con piscina para adultos y niños, ideal para los fines de semana.',
    imagen: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&q=80',
  },
  {
    nombre: 'Salón social',
    descripcion: 'Espacio para celebraciones, reuniones de copropietarios y eventos familiares.',
    imagen: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80',
  },
  {
    nombre: 'Gimnasio',
    descripcion: 'Equipos de cardio y fuerza disponibles todos los días para los residentes.',
    imagen: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  },
]

export function Home() {
  const navegar = useNavigate()
  const { usuario, esAdministrador, cerrarSesion } = useSesion()

  function salir() {
    cerrarSesion()
    navegar('/login')
  }

  function pintarZona(zona) {
    return (
      <div className="col-md-4" key={zona.nombre}>
        <div className="card tarjeta-zona shadow-sm h-100">
          <img src={zona.imagen} className="card-img-top" alt={zona.nombre} />
          <div className="card-body">
            <h5 className="card-title fw-bold">{zona.nombre}</h5>
            <p className="card-text text-muted">{zona.descripcion}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Barra de navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 fixed-top">
        <div className="container">
          <Link to="/home" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
            <i className="bi bi-buildings-fill fs-4"></i> Paseo App
          </Link>
          <div className="d-flex align-items-center gap-2">
            <span className="text-white-50 small d-none d-md-inline me-2">
              <i className="bi bi-person-circle me-1"></i>{usuario.nombres} · {usuario.rol}
            </span>
            {/* Solo el administrador ve el boton de espacios */}
            {esAdministrador && (
              <Link to="/espacios" className="btn btn-outline-light btn-sm">
                <i className="bi bi-door-open me-1"></i>Espacios
              </Link>
            )}
            <Link to="/reservas" className="btn btn-outline-light btn-sm">
              <i className="bi bi-calendar-check me-1"></i>Reservas
            </Link>
            <button type="button" onClick={salir} className="btn btn-light btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Portada */}
      <header className="portada" style={{ backgroundImage: `url(${IMAGEN_PORTADA})` }}>
        <div className="container">
          <div className="col-lg-7">
            <span className="badge bg-warning text-dark mb-3 px-3 py-2">
              <i className="bi bi-geo-alt-fill me-1"></i>Sabaneta, Antioquia
            </span>
            <h1 className="display-3 fw-bold mb-3">Bienvenido a tu unidad residencial</h1>
            <p className="lead mb-4">
              Gestiona las zonas comunes y reserva el espacio que necesitas, cuando lo necesitas.
              Todo desde un solo lugar.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/reservas" className="btn btn-warning btn-lg px-4">
                <i className="bi bi-calendar-plus me-2"></i>Hacer una reserva
              </Link>
              {esAdministrador && (
                <Link to="/espacios" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-plus-circle me-2"></i>Registrar espacio
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Zonas comunes */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Nuestras zonas comunes</h2>
            <p className="text-muted">Conoce los espacios que puedes disfrutar y reservar.</p>
          </div>
          <div className="row g-4">
            {zonas.map(pintarZona)}
          </div>
        </div>
      </section>

      {/* Acciones principales */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="text-center mb-5">
            <h2 className="fw-bold">¿Qué deseas hacer?</h2>
            <p className="text-muted">Administra los espacios o aparta el tuyo en pocos pasos.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {esAdministrador && (
              <div className="col-md-5">
                <div className="card tarjeta-accion shadow-sm h-100 text-center p-4">
                  <div className="icono-circulo mx-auto mb-3">
                    <i className="bi bi-door-open"></i>
                  </div>
                  <h4 className="fw-bold">Registrar espacio</h4>
                  <p className="text-muted">
                    Crea las zonas comunes de la unidad con su descripción, foto y aforo máximo.
                  </p>
                  <Link to="/espacios" className="btn btn-marca mt-auto">
                    Ir al formulario <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            )}
            <div className="col-md-5">
              <div className="card tarjeta-accion shadow-sm h-100 text-center p-4">
                <div className="icono-circulo mx-auto mb-3">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h4 className="fw-bold">Registrar reserva</h4>
                <p className="text-muted">
                  Elige la fecha y la hora en que quieres usar uno de los espacios disponibles.
                </p>
                <Link to="/reservas" className="btn btn-marca mt-auto">
                  Ir al formulario <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <i className="bi bi-clock-history fs-1 texto-marca"></i>
              <h5 className="fw-bold mt-3">Reservas en segundos</h5>
              <p className="text-muted">Sin llamadas ni filas en la portería.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-people fs-1 texto-marca"></i>
              <h5 className="fw-bold mt-3">Control de aforo</h5>
              <p className="text-muted">Cada espacio respeta su capacidad máxima.</p>
            </div>
            <div className="col-md-4">
              <i className="bi bi-shield-check fs-1 texto-marca"></i>
              <h5 className="fw-bold mt-3">Administración segura</h5>
              <p className="text-muted">Roles de administrador y residente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="bg-dark text-white py-4">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 fw-bold">
            <i className="bi bi-buildings-fill fs-4"></i> Paseo App
          </div>
          <div className="text-white-50 small">
            <i className="bi bi-geo-alt me-1"></i>Sabaneta, Antioquia, Colombia
            <span className="mx-2">|</span>© 2026 Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  )
}
