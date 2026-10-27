import { useEffect, useMemo, useState } from 'react'
import { listarReservas, cancelarReserva } from '../services/servicioReservas.js'
import { listarEspacios } from '../services/servicioEspacios.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'

export function ReservasGlobales() {
  const [reservas, setReservas] = useState([])
  const [espacios, setEspacios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [reservaEnProceso, setReservaEnProceso] = useState(null)

  // Filtros
  const [filtroFecha, setFiltroFecha] = useState('')
  const [filtroEspacio, setFiltroEspacio] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODOS')

  useEffect(function () {
    async function cargarDatos() {
      try {
        const [datosReservas, datosEspacios] = await Promise.all([
          listarReservas(),
          listarEspacios(),
        ])
        setReservas(datosReservas)
        setEspacios(datosEspacios)
      } catch (err) {
        setError(err.response?.data?.message || 'No fue posible cargar las reservas globales')
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  async function confirmarCancelacion(id) {
    if (!window.confirm('¿Seguro que deseas cancelar esta reserva como administrador?')) {
      return
    }

    setReservaEnProceso(id)
    setError('')
    setMensajeExito('')

    try {
      const reservaCancelada = await cancelarReserva(id)
      setReservas(function (actuales) {
        return actuales.map((r) => (r.id === id ? reservaCancelada : r))
      })
      setMensajeExito('Reserva cancelada correctamente.')
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible cancelar la reserva')
    } finally {
      setReservaEnProceso(null)
    }
  }

  // Filtrado en memoria
  const reservasFiltradas = useMemo(function () {
    return reservas.filter(function (reserva) {
      const coincideFecha = filtroFecha === '' || reserva.fecha === filtroFecha
      const coincideEspacio = filtroEspacio === '' || reserva.espacioId === filtroEspacio
      const coincideEstado = filtroEstado === 'TODOS' || reserva.estado === filtroEstado
      return coincideFecha && coincideEspacio && coincideEstado
    })
  }, [reservas, filtroFecha, filtroEspacio, filtroEstado])

  const totalConfirmadas = reservas.filter((r) => r.estado === 'CONFIRMADA').length
  const totalCanceladas = reservas.filter((r) => r.estado === 'CANCELADA').length

  return (
    <div className="container pagina-interna">
      <Navbar />

      <div className="encabezado-pagina mb-4">
        <span className="etiqueta-seccion">Administración</span>
        <h1 className="fw-bold mt-2 mb-1">Gestión global de reservas</h1>
        <p className="texto-suave mb-0">
          Supervisa y gestiona las reservas de todas las zonas comunes de la unidad residencial.
        </p>
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

      {/* Tarjetas de Resumen Numérico */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card-neutra p-3 d-flex align-items-center gap-3">
            <div className="icono-circulo" style={{ width: '46px', height: '46px', fontSize: '1.2rem' }}>
              <i className="bi bi-calendar3"></i>
            </div>
            <div>
              <span className="text-muted small">Total reservas</span>
              <h4 className="fw-bold mb-0">{reservas.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-neutra p-3 d-flex align-items-center gap-3">
            <div
              className="icono-circulo"
              style={{
                width: '46px',
                height: '46px',
                fontSize: '1.2rem',
                backgroundColor: 'var(--color-exito-fondo)',
                color: 'var(--color-exito)',
              }}
            >
              <i className="bi bi-check2-circle"></i>
            </div>
            <div>
              <span className="text-muted small">Confirmadas</span>
              <h4 className="fw-bold mb-0 text-success">{totalConfirmadas}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-neutra p-3 d-flex align-items-center gap-3">
            <div
              className="icono-circulo"
              style={{
                width: '46px',
                height: '46px',
                fontSize: '1.2rem',
                backgroundColor: '#F1F3F2',
                color: '#6C7973',
              }}
            >
              <i className="bi bi-slash-circle"></i>
            </div>
            <div>
              <span className="text-muted small">Canceladas</span>
              <h4 className="fw-bold mb-0 text-muted">{totalCanceladas}</h4>
            </div>
          </div>
        </div>
      </div>

      {cargando ? (
        <div className="py-5 text-center">
          <Spinner texto="Cargando historial de reservas de la unidad..." />
        </div>
      ) : (
        <>
          {/* Barra de Filtros */}
          <div className="card-neutra p-3 mb-4">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label small fw-semibold">Fecha</label>
                <input
                  type="date"
                  className="form-control"
                  value={filtroFecha}
                  onChange={(e) => setFiltroFecha(e.target.value)}
                />
              </div>

              <div className="col-md-5">
                <label className="form-label small fw-semibold">Zona común</label>
                <select
                  className="form-select"
                  value={filtroEspacio}
                  onChange={(e) => setFiltroEspacio(e.target.value)}
                >
                  <option value="">Todas las zonas comunes</option>
                  {espacios.map((espacio) => (
                    <option key={espacio.id} value={espacio.id}>
                      {espacio.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label small fw-semibold">Estado</label>
                <select
                  className="form-select"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="TODOS">Todos los estados</option>
                  <option value="CONFIRMADA">Confirmadas</option>
                  <option value="CANCELADA">Canceladas</option>
                </select>
              </div>
            </div>

            {(filtroFecha || filtroEspacio || filtroEstado !== 'TODOS') && (
              <div className="mt-3 pt-2 border-top text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-fantasma"
                  onClick={() => {
                    setFiltroFecha('')
                    setFiltroEspacio('')
                    setFiltroEstado('TODOS')
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Limpiar filtros
                </button>
              </div>
            )}
          </div>

          {/* Tabla de Reservas */}
          {reservasFiltradas.length === 0 ? (
            <div className="card-neutra p-5 text-center my-3">
              <i className="bi bi-inbox fs-2 text-muted mb-2 d-block"></i>
              <h5 className="fw-semibold">No hay reservas coincidentes</h5>
              <p className="texto-suave mb-0">Prueba ajustando los filtros de fecha, espacio o estado.</p>
            </div>
          ) : (
            <div className="card-neutra overflow-hidden shadow-sm">
              <div className="table-responsive">
                <table className="tabla-elegante align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Horario</th>
                      <th>Zona común</th>
                      <th>Residente</th>
                      <th>Aforo</th>
                      <th>Estado</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservasFiltradas.map((r) => {
                      const estaConfirmada = r.estado === 'CONFIRMADA'
                      return (
                        <tr key={r.id}>
                          <td>
                            <strong>{r.fecha}</strong>
                          </td>
                          <td>
                            {r.horaInicio}{' '}
                            <span className="text-muted small">({r.duracionHoras}h)</span>
                          </td>
                          <td className="fw-semibold text-primary-emphasis">
                            {r.espacioNombre}
                          </td>
                          <td>
                            <i className="bi bi-person me-1 text-muted"></i>
                            {r.usuarioNombre || 'Residente'}
                          </td>
                          <td>
                            {r.numeroPersonas} persona{r.numeroPersonas > 1 ? 's' : ''}
                          </td>
                          <td>
                            {estaConfirmada ? (
                              <span className="badge-estado confirmada">
                                <i className="bi bi-check-circle me-1"></i>Confirmada
                              </span>
                            ) : (
                              <span className="badge-estado cancelada">
                                <i className="bi bi-x-circle me-1"></i>Cancelada
                              </span>
                            )}
                          </td>
                          <td className="text-end">
                            {estaConfirmada && (
                              <button
                                type="button"
                                className="btn-peligro-suave btn-sm"
                                onClick={() => confirmarCancelacion(r.id)}
                                disabled={reservaEnProceso === r.id}
                              >
                                {reservaEnProceso === r.id ? 'Cancelando...' : 'Cancelar'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
