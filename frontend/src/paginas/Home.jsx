import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarEspacios } from '../services/servicioEspacios.js'
import { TarjetaEspacio } from '../componentes/TarjetaEspacio.jsx'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'
import { useSesion } from '../contexto/ContextoSesion.jsx'

export function Home() {
  const { usuario, esAdministrador } = useSesion()
  const [espacios, setEspacios] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(function () {
    async function cargarEspacios() {
      try {
        const datos = await listarEspacios()
        setEspacios(datos)
      } catch {
        setEspacios([])
      } finally {
        setCargando(false)
      }
    }
    cargarEspacios()
  }, [])

  return (
    <div style={{ paddingTop: '60px' }}>
      <Navbar />

      {/* Portada relajante con paleta sólida y neutra */}
      <header className="portada-relajante">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="insignia-ubicacion">
                  <i className="bi bi-geo-alt me-1"></i>Sabaneta, Antioquia
                </span>
                <span className="insignia-ubicacion">
                  <i className="bi bi-shield-check me-1"></i>Portal Residencial
                </span>
              </div>

              <h1 className="titulo-portada mb-3">
                Bienvenido a casa{usuario?.nombres ? `, ${usuario.nombres.split(' ')[0]}` : ''}.
              </h1>

              <p className="subtitulo-portada mb-4">
                Disfruta los espacios comunes de tu unidad residencial. Reserva la piscina, gimnasio,
                zona BBQ o salón social con total tranquilidad, en tiempo real y sin filas.
              </p>

              <div className="d-flex flex-wrap gap-3">
                <Link to="/reservas" className="btn-portada-primario">
                  <i className="bi bi-calendar-plus"></i>
                  <span>Hacer una reserva</span>
                </Link>
                <Link to="/catalogo" className="btn-portada-secundario">
                  <i className="bi bi-grid"></i>
                  <span>Explorar catálogo</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Franja de métricas e indicadores de tranquilidad */}
      <section className="estadisticas-franja">
        <div className="container">
          <div className="row g-4 justify-content-between">
            <div className="col-md-4">
              <div className="item-estadistica">
                <div className="icono-estadistica">
                  <i className="bi bi-tree"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-0">Zonas exclusivas</h6>
                  <small className="texto-suave">Espacios cuidados para tu descanso y recreación</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="item-estadistica">
                <div className="icono-estadistica">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-0">Disponibilidad clara</h6>
                  <small className="texto-suave">Horarios y aforos transparentes en cada reserva</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="item-estadistica">
                <div className="icono-estadistica">
                  <i className="bi bi-shield-check"></i>
                </div>
                <div>
                  <h6 className="fw-semibold mb-0">Gestión sin filas</h6>
                  <small className="texto-suave">Reserva y cancela desde tu móvil o computadora</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Zonas Comunes con imágenes */}
      <section className="seccion">
        <div className="container">
          <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
            <div>
              <span className="etiqueta-seccion">Zonas comunes</span>
              <h2 className="titulo-seccion mt-2 mb-1">Espacios disponibles para ti</h2>
              <p className="texto-suave mb-0">Selecciona el espacio que deseas utilizar y confirma tu horario.</p>
            </div>
            <Link to="/catalogo" className="btn btn-fantasma btn-sm">
              Ver todos ({espacios.length}) <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>

          {cargando ? (
            <div className="py-5 text-center">
              <Spinner texto="Cargando espacios de la unidad..." />
            </div>
          ) : espacios.length === 0 ? (
            <div className="card-neutra p-5 text-center">
              <i className="bi bi-info-circle fs-2 text-muted mb-3 d-block"></i>
              <h5>No hay zonas comunes registradas</h5>
              <p className="texto-suave mb-3">En este momento no se encontraron espacios registrados en la base de datos.</p>
              {esAdministrador && (
                <Link to="/admin/nuevo-espacio" className="btn btn-marca btn-sm">
                  <i className="bi bi-plus-lg me-1"></i>Registrar primer espacio
                </Link>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {espacios.slice(0, 6).map((espacio) => (
                <div className="col-lg-4 col-md-6" key={espacio.id}>
                  <TarjetaEspacio espacio={espacio} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Acciones principales del usuario */}
      <section className="seccion seccion-blanca border-top border-bottom">
        <div className="container">
          <div className="text-center mb-5">
            <span className="etiqueta-seccion">Servicios</span>
            <h2 className="titulo-seccion mt-2 mb-1">¿Qué deseas hacer hoy?</h2>
            <p className="texto-suave">Accesos directos para la gestión de tus zonas comunes.</p>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-md-4">
              <div className="tarjeta-accion h-100">
                <div className="icono-circulo mx-auto mb-3">
                  <i className="bi bi-calendar-plus"></i>
                </div>
                <h5 className="fw-semibold mb-2">Nueva reserva</h5>
                <p className="texto-suave mb-4">
                  Elige la fecha, la franja horaria y la cantidad de acompañantes para tu próxima visita.
                </p>
                <Link to="/reservas" className="btn btn-marca mt-auto">
                  <span>Reservar ahora</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div className="tarjeta-accion h-100">
                <div className="icono-circulo mx-auto mb-3">
                  <i className="bi bi-journal-bookmark"></i>
                </div>
                <h5 className="fw-semibold mb-2">Mis reservas</h5>
                <p className="texto-suave mb-4">
                  Revisa el historial de tus solicitudes confirmadas o cancela las que ya no vayas a usar.
                </p>
                <Link to="/mis-reservas" className="btn btn-fantasma mt-auto">
                  <span>Ver mi historial</span>
                  <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>

            {esAdministrador && (
              <div className="col-md-4">
                <div className="tarjeta-accion h-100">
                  <div className="icono-circulo mx-auto mb-3">
                    <i className="bi bi-shield-gear"></i>
                  </div>
                  <h5 className="fw-semibold mb-2">Panel administrativo</h5>
                  <p className="texto-suave mb-4">
                    Visualiza las reservas de toda la unidad residencial o agrega nuevos espacios comunes.
                  </p>
                  <Link to="/admin/reservas-globales" className="btn btn-fantasma mt-auto">
                    <span>Gestionar reservas</span>
                    <i className="bi bi-arrow-right"></i>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Pie de página neutro y relajante */}
      <footer className="pie-pagina">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <span className="logo-insignia" style={{ width: '28px', height: '28px', fontSize: '0.85rem' }}>
                <i className="bi bi-buildings"></i>
              </span>
              <strong className="text-dark">Portal del Paraíso</strong>
              <span className="text-muted small">· Unidad Residencial</span>
            </div>
            <div className="texto-suave small">
              <i className="bi bi-geo-alt me-1"></i>Sabaneta, Antioquia
              <span className="mx-2">|</span>
              <span>Gestión de Zonas Comunes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
