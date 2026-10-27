import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { listarEspacios } from '../services/servicioEspacios.js'
import { fotoDeEspacio } from '../services/fotosEspacios.js'
import { useSesion } from '../contexto/ContextoSesion.jsx'
import fachada from '../assets/fachada_unidad.jpg'

export function Home() {
  const navegar = useNavigate()
  const { usuario, esAdministrador, cerrarSesion } = useSesion()

  const [espacios, setEspacios] = useState([])
  const [cargando, setCargando] = useState(true)

  // Cargamos los espacios reales del API (mismos del catalogo)
  useEffect(function () {
    async function cargarEspacios() {
      try {
        const datos = await listarEspacios()
        setEspacios(datos)
      } catch {
        // Si falla mostramos la portada igual, sin zonas
        setEspacios([])
      } finally {
        setCargando(false)
      }
    }
    cargarEspacios()
  }, [])

  function salir() {
    cerrarSesion()
    navegar('/login')
  }

  function pintarZona(espacio) {
    return (
      <div className="col-md-4" key={espacio.id}>
        <div className="tarjeta-zona h-100">
          <div className="tarjeta-zona-foto">
            <img src={fotoDeEspacio(espacio)} alt={espacio.nombre} />
          </div>
          <div className="tarjeta-zona-cuerpo">
            <h5 className="fw-bold mb-2">{espacio.nombre}</h5>
            <p className="mb-0">{espacio.descripcion}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Barra de navegación */}
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
            <Link to="/catalogo" className="btn btn-fantasma btn-sm">
              <i className="bi bi-grid me-1"></i>Catálogo
            </Link>
            <Link to="/reservas" className="btn btn-fantasma btn-sm">
              <i className="bi bi-calendar-check me-1"></i>Reservas
            </Link>
            <button type="button" onClick={salir} className="btn btn-claro btn-sm">
              <i className="bi bi-box-arrow-right me-1"></i>Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Portada con la fachada de la unidad */}
      <header className="portada" style={{ backgroundImage: `url(${fachada})` }}>
        <div className="container">
          <div className="col-lg-7">
            <span className="insignia-ubicacion mb-3">
              <i className="bi bi-geo-alt-fill me-1"></i>Sabaneta, Antioquia
            </span>
            <h1 className="titulo-portada mb-3">Portal del Paraíso</h1>
            <p className="subtitulo-portada mb-4">
              Tu unidad residencial en Sabaneta: gestiona las zonas comunes y reserva el espacio que necesitas, cuando lo necesitas.
              Todo desde un solo lugar.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/reservas" className="btn btn-marca btn-lg px-4">
                <i className="bi bi-calendar-plus me-2"></i>Hacer una reserva
              </Link>
              <Link to="/catalogo" className="btn btn-fantasma btn-lg px-4">
                <i className="bi bi-grid me-2"></i>Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Zonas comunes: datos reales del API */}
      <section className="seccion py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="etiqueta-seccion">Zonas comunes</span>
            <h2 className="titulo-seccion fw-bold mt-2">Espacios pensados para ti</h2>
            <p className="texto-suave">Conoce los espacios que puedes disfrutar y reservar.</p>
          </div>
          {cargando && <p className="text-center texto-suave">Cargando espacios...</p>}
          {!cargando && (
            espacios.length === 0
              ? <p className="text-center texto-suave">Todavía no hay espacios registrados.</p>
              : <div className="row g-4">{espacios.map(pintarZona)}</div>
          )}
        </div>
      </section>

      {/* Acciones principales */}
      <section className="seccion-alt py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="etiqueta-seccion">Acciones</span>
            <h2 className="titulo-seccion fw-bold mt-2">¿Qué deseas hacer?</h2>
            <p className="texto-suave">Administra los espacios o aparta el tuyo en pocos pasos.</p>
          </div>
          <div className="row g-4 justify-content-center">
            {esAdministrador && (
              <div className="col-md-5">
                <div className="tarjeta-accion h-100 text-center p-4">
                  <div className="icono-circulo mx-auto mb-3">
                    <i className="bi bi-door-open"></i>
                  </div>
                  <h4 className="fw-bold">Registrar espacio</h4>
                  <p className="texto-suave">
                    Crea las zonas comunes de la unidad con su descripción, foto y aforo máximo.
                  </p>
                  <Link to="/admin/nuevo-espacio" className="btn btn-marca mt-auto">
                    Ir al formulario <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            )}
            <div className="col-md-5">
              <div className="tarjeta-accion h-100 text-center p-4">
                <div className="icono-circulo mx-auto mb-3">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h4 className="fw-bold">Registrar reserva</h4>
                <p className="texto-suave">
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
      <section className="seccion py-5">
        <div className="container py-4">
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="icono-circulo mx-auto mb-3"><i className="bi bi-clock-history"></i></div>
              <h5 className="fw-bold">Reservas en segundos</h5>
              <p className="texto-suave mb-0">Sin llamadas ni filas en la portería.</p>
            </div>
            <div className="col-md-4">
              <div className="icono-circulo mx-auto mb-3"><i className="bi bi-people"></i></div>
              <h5 className="fw-bold">Control de aforo</h5>
              <p className="texto-suave mb-0">Cada espacio respeta su capacidad máxima.</p>
            </div>
            <div className="col-md-4">
              <div className="icono-circulo mx-auto mb-3"><i className="bi bi-shield-check"></i></div>
              <h5 className="fw-bold">Administración segura</h5>
              <p className="texto-suave mb-0">Roles de administrador y residente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de página */}
      <footer className="pie-pagina py-4">
        <div className="container d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2 fw-bold">
            <span className="logo-insignia"><i className="bi bi-buildings-fill"></i></span>
            Portal del Paraíso
          </div>
          <div className="texto-suave small">
            <i className="bi bi-geo-alt me-1"></i>Sabaneta, Antioquia, Colombia
            <span className="mx-2">|</span>© 2026 Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  )
}
