import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { listarEspacios } from '../services/servicioEspacios.js'
import { crearReserva } from '../services/servicioReservas.js'
import { CLAVE_SESION } from '../services/clienteApi.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'

export function RegistroReserva() {
  const ubicacion = useLocation()

  // Si llegamos desde "Reservar ahora" traemos el espacio preseleccionado
  const espacioPreseleccionado = ubicacion.state?.espacioId ?? ''

  const [espacios, setEspacios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [reserva, setReserva] = useState({
    espacioId: espacioPreseleccionado,
    fecha: '',
    horaInicio: '',
    duracionHoras: '1',
    numeroPersonas: '1',
    notaOpcional: '',
  })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [exito, setExito] = useState(false)
  const [enviando, setEnviando] = useState(false)

  useEffect(function () {
    async function cargarEspacios() {
      try {
        const datos = await listarEspacios()
        setEspacios(datos)
      } catch {
        setErrorApi('No fue posible cargar los espacios')
      } finally {
        setCargando(false)
      }
    }
    cargarEspacios()
  }, [])

  const espacioSeleccionado = espacios.find(function (espacio) {
    return espacio.id === reserva.espacioId
  })

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setReserva({ ...reserva, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    const hoy = new Date().toISOString().split('T')[0]
    if (reserva.espacioId === '') {
      nuevosErrores.espacioId = 'Seleccione un espacio'
    }
    if (reserva.fecha === '') {
      nuevosErrores.fecha = 'La fecha es obligatoria'
    } else if (reserva.fecha < hoy) {
      nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy'
    }
    if (reserva.horaInicio === '') {
      nuevosErrores.horaInicio = 'La hora es obligatoria'
    }
    if (Number(reserva.numeroPersonas) <= 0) {
      nuevosErrores.numeroPersonas = 'Debe indicar el número de personas'
    } else if (espacioSeleccionado && Number(reserva.numeroPersonas) > espacioSeleccionado.aforo) {
      nuevosErrores.numeroPersonas = `Máximo ${espacioSeleccionado.aforo} personas (aforo del espacio)`
    }
    return nuevosErrores
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setExito(false)
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setErrorApi('')
    setEnviando(true)
    try {
      const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION))
      await crearReserva({
        usuario: { id: sesion.id },
        espacio: { id: reserva.espacioId },
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        duracionHoras: Number(reserva.duracionHoras),
        numeroPersonas: Number(reserva.numeroPersonas),
        notaOpcional: reserva.notaOpcional,
      })
      setExito(true)
      setReserva({
        espacioId: '',
        fecha: '',
        horaInicio: '',
        duracionHoras: '1',
        numeroPersonas: '1',
        notaOpcional: '',
      })
    } catch (error) {
      setErrorApi(error.response?.data?.message || 'No fue posible crear la reserva')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container pagina-interna">
      <Navbar />

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="encabezado-pagina mb-4">
            <span className="etiqueta-seccion">Reservas</span>
            <h1 className="fw-bold mt-2 mb-1">Nueva reserva</h1>
            <p className="texto-suave mb-0">Elige el espacio, la fecha y la hora.</p>
          </div>

          {exito && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2"></i>¡Reserva confirmada! Revísala en "Mis reservas".
            </div>
          )}
          {errorApi && <div className="alert alert-danger">{errorApi}</div>}

          {cargando
            ? <Spinner texto="Cargando espacios..." />
            : <form onSubmit={manejarEnvio} noValidate className="card p-4 shadow-sm">

              <div className="mb-3">
                <label className="form-label fw-semibold">Espacio común</label>
                <select
                  name="espacioId"
                  className={`form-select ${errores.espacioId ? 'is-invalid' : ''}`}
                  value={reserva.espacioId}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un espacio...</option>
                  {espacios.map(function (espacio) {
                    return <option key={espacio.id} value={espacio.id}>{espacio.nombre}</option>
                  })}
                </select>
                <div className="invalid-feedback">{errores.espacioId}</div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      type="date"
                      name="fecha"
                      className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
                      value={reserva.fecha}
                      onChange={manejarCambio}
                    />
                    <div className="invalid-feedback">{errores.fecha}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Hora de inicio</label>
                    <input
                      type="time"
                      name="horaInicio"
                      className={`form-control ${errores.horaInicio ? 'is-invalid' : ''}`}
                      value={reserva.horaInicio}
                      onChange={manejarCambio}
                    />
                    <div className="invalid-feedback">{errores.horaInicio}</div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Duración (horas)</label>
                    <select
                      name="duracionHoras"
                      className="form-select"
                      value={reserva.duracionHoras}
                      onChange={manejarCambio}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(function (horas) {
                        return <option key={horas} value={horas}>{horas} hora{horas > 1 ? 's' : ''}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Número de personas
                      {espacioSeleccionado && (
                        <span className="text-muted fw-normal"> (máximo {espacioSeleccionado.aforo})</span>
                      )}
                    </label>
                    <input
                      type="number"
                      name="numeroPersonas"
                      min="1"
                      max={espacioSeleccionado?.aforo ?? undefined}
                      className={`form-control ${errores.numeroPersonas ? 'is-invalid' : ''}`}
                      value={reserva.numeroPersonas}
                      onChange={manejarCambio}
                    />
                    {espacioSeleccionado && (
                      <div className="form-text">
                        Aforo del espacio: {espacioSeleccionado.aforo} personas
                      </div>
                    )}
                    <div className="invalid-feedback">{errores.numeroPersonas}</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Nota (opcional)</label>
                <textarea
                  name="notaOpcional"
                  rows="2"
                  placeholder="Ej: celebración de cumpleaños"
                  className="form-control"
                  value={reserva.notaOpcional}
                  onChange={manejarCambio}
                />
              </div>

              <button type="submit" className="btn btn-marca btn-lg" disabled={enviando}>
                <i className="bi bi-calendar-check me-2"></i>
                {enviando ? 'Reservando...' : 'Confirmar reserva'}
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  )
}
