import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listarMisReservas, cancelarReserva } from '../services/servicioReservas.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'

export function MisReservas() {
  const [reservas, setReservas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [reservaEnProceso, setReservaEnProceso] = useState(null)

  useEffect(function () {
    async function cargarReservas() {
      try {
        const datos = await listarMisReservas()
        setReservas(datos)
      } catch (err) {
        setError(err.response?.data?.message || 'No fue posible cargar tus reservas')
      } finally {
        setCargando(false)
      }
    }
    cargarReservas()
  }, [])

  async function confirmarCancelacion(id) {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return
    }

    setReservaEnProceso(id)
    setError('')
    setMensajeExito('')

    try {
      const reservaCancelada = await cancelarReserva(id)
      // Actualizamos inmediatamente el estado en pantalla sin recargar
      setReservas(function (actuales) {
        return actuales.map(function (item) {
          return item.id === id ? reservaCancelada : item
        })
      })
      setMensajeExito('La reserva ha sido cancelada exitosamente.')
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible cancelar la reserva.')
    } finally {
      setReservaEnProceso(null)
    }
  }

  return (
    <div className="container pagina-interna">
      <Navbar />

      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div>
          <span className="etiqueta-seccion">Historial</span>
          <h1 className="fw-bold mt-2 mb-1">Mis reservas</h1>
          <p className="texto-suave mb-0">
            Consulta el estado de tus reservas activas y pasadas en la unidad.
          </p>
        </div>
        <Link to="/reservas" className="btn btn-marca btn-sm">
          <i className="bi bi-calendar-plus me-1"></i>Nueva reserva
        </Link>
      </div>

      {mensajeExito && (
        <div className="alerta-relajante exito mb-4">
          <i className="bi bi-check-circle-fill"></i>
          <span>{mensajeExito}</span>
        </div>
      )}

      {error && (
        <div className="alerta-relajante error mb-4">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
        </div>
      )}

      {cargando && (
        <div className="py-5 text-center">
          <Spinner texto="Cargando tus reservas..." />
        </div>
      )}

      {!cargando && !error && (
        reservas.length === 0 ? (
          <div className="card-neutra p-5 text-center my-4">
            <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
            <h5 className="fw-semibold">Aún no tienes reservas registradas</h5>
            <p className="texto-suave mb-4">
              Disfruta de las instalaciones de la unidad reservando tu primer espacio ahora mismo.
            </p>
            <Link to="/catalogo" className="btn btn-marca">
              <i className="bi bi-grid me-1"></i>Ver catálogo de espacios
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {reservas.map(function (reserva) {
              const estaConfirmada = reserva.estado === 'CONFIRMADA'
              return (
                <div className="col-md-6" key={reserva.id}>
                  <div className="card-neutra p-4 h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">{reserva.espacioNombre}</h5>
                          <span className="small text-muted">
                            <i className="bi bi-person me-1"></i>Residente: {reserva.usuarioNombre || 'Tú'}
                          </span>
                        </div>
                        {estaConfirmada ? (
                          <span className="badge-estado confirmada">
                            <i className="bi bi-check-circle me-1"></i>Confirmada
                          </span>
                        ) : (
                          <span className="badge-estado cancelada">
                            <i className="bi bi-x-circle me-1"></i>Cancelada
                          </span>
                        )}
                      </div>

                      <div className="p-3 bg-light rounded-3 mb-3 small">
                        <div className="row g-2">
                          <div className="col-6">
                            <span className="text-muted d-block">Fecha:</span>
                            <strong><i className="bi bi-calendar3 me-1"></i>{reserva.fecha}</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">Horario:</span>
                            <strong><i className="bi bi-clock me-1"></i>{reserva.horaInicio} ({reserva.duracionHoras}h)</strong>
                          </div>
                          <div className="col-6">
                            <span className="text-muted d-block">Asistentes:</span>
                            <span><i className="bi bi-people me-1"></i>{reserva.numeroPersonas} persona{reserva.numeroPersonas > 1 ? 's' : ''}</span>
                          </div>
                          {reserva.notaOpcional && (
                            <div className="col-12 mt-2 pt-2 border-top">
                              <span className="text-muted d-block">Nota:</span>
                              <span className="fst-italic">{reserva.notaOpcional}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {estaConfirmada && (
                      <div className="pt-2">
                        <button
                          type="button"
                          className="btn-peligro-suave w-100"
                          onClick={() => confirmarCancelacion(reserva.id)}
                          disabled={reservaEnProceso === reserva.id}
                        >
                          <i className="bi bi-trash3 me-1"></i>
                          {reservaEnProceso === reserva.id ? 'Cancelando...' : 'Cancelar reserva'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )
      )}
    </div>
  )
}
