import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { listarEspacios } from '../services/servicioEspacios.js'
import { crearReserva } from '../services/servicioReservas.js'
import { CLAVE_SESION } from '../services/clienteApi.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'
import { useSesion } from '../contexto/ContextoSesion.jsx'
import { fotoDeEspacio } from '../services/fotosEspacios.js'

export function RegistroReserva() {
  const ubicacion = useLocation()
  const { usuario } = useSesion()

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

  // Fecha mínima permitida (hoy) en formato AAAA-MM-DD
  const hoyStr = new Date().toISOString().split('T')[0]

  useEffect(function () {
    async function cargarEspacios() {
      try {
        const datos = await listarEspacios()
        setEspacios(datos)
        // Si no habia preseleccionado y hay espacios, tomamos el primero si se desea o dejamos vacio
        if (espacioPreseleccionado && datos.some((e) => e.id === espacioPreseleccionado)) {
          setReserva((prev) => ({ ...prev, espacioId: espacioPreseleccionado }))
        }
      } catch {
        setErrorApi('No fue posible cargar los espacios comunes.')
      } finally {
        setCargando(false)
      }
    }
    cargarEspacios()
  }, [espacioPreseleccionado])

  const espacioSeleccionado = espacios.find(function (e) {
    return e.id === reserva.espacioId
  })

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setReserva((prev) => ({ ...prev, [name]: value }))
    // Limpiar error del campo modificado
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validar() {
    const nuevosErrores = {}

    if (!reserva.espacioId) {
      nuevosErrores.espacioId = 'Seleccione una zona común'
    }

    if (!reserva.fecha) {
      nuevosErrores.fecha = 'La fecha es obligatoria'
    } else if (reserva.fecha < hoyStr) {
      nuevosErrores.fecha = 'La fecha no puede ser anterior al día de hoy'
    }

    if (!reserva.horaInicio) {
      nuevosErrores.horaInicio = 'La hora de inicio es obligatoria'
    } else if (espacioSeleccionado?.horarioApertura && espacioSeleccionado?.horarioCierre) {
      const horaIn = reserva.horaInicio
      const apertura = espacioSeleccionado.horarioApertura
      if (horaIn < apertura) {
        nuevosErrores.horaInicio = `La zona abre a las ${apertura}`
      }
    }

    const personas = Number(reserva.numeroPersonas)
    if (!reserva.numeroPersonas || personas <= 0) {
      nuevosErrores.numeroPersonas = 'Indique al menos 1 persona'
    } else if (espacioSeleccionado && personas > espacioSeleccionado.aforo) {
      nuevosErrores.numeroPersonas = `Supera el aforo máximo de ${espacioSeleccionado.aforo} personas`
    }

    return nuevosErrores
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setExito(false)
    setErrorApi('')

    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setEnviando(true)
    try {
      const sesionGuardada = JSON.parse(localStorage.getItem(CLAVE_SESION) || '{}')
      const usuarioId = usuario?.id || sesionGuardada?.id

      await crearReserva({
        usuario: { id: usuarioId },
        espacio: { id: reserva.espacioId },
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        duracionHoras: Number(reserva.duracionHoras),
        numeroPersonas: Number(reserva.numeroPersonas),
        notaOpcional: reserva.notaOpcional.trim(),
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      const msj = error.response?.data?.message || error.response?.data || 'No fue posible crear la reserva. Verifica el horario y aforo.'
      setErrorApi(typeof msj === 'string' ? msj : 'Error al procesar la reserva.')
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
            <h1 className="fw-bold mt-2 mb-1">Nueva reserva de zona común</h1>
            <p className="texto-suave mb-0">
              Selecciona el espacio deseado, la fecha y el horario de uso.
            </p>
          </div>

          {exito && (
            <div className="alerta-relajante exito mb-4">
              <i className="bi bi-check-circle-fill fs-5"></i>
              <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2">
                <span>¡Tu reserva ha sido registrada y confirmada con éxito!</span>
                <Link to="/mis-reservas" className="btn btn-marca btn-sm">
                  Ver en Mis reservas
                </Link>
              </div>
            </div>
          )}

          {errorApi && (
            <div className="alerta-relajante error mb-4">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <span>{errorApi}</span>
            </div>
          )}

          {cargando ? (
            <div className="py-5 text-center">
              <Spinner texto="Cargando información de espacios..." />
            </div>
          ) : (
            <form onSubmit={manejarEnvio} noValidate className="card-neutra p-4 p-md-5">
              {/* Selector de Espacio */}
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Zona común a reservar <span className="text-danger">*</span>
                </label>
                <select
                  name="espacioId"
                  className={`form-select ${errores.espacioId ? 'is-invalid' : ''}`}
                  value={reserva.espacioId}
                  onChange={manejarCambio}
                >
                  <option value="">Selecciona una zona común...</option>
                  {espacios.map(function (espacio) {
                    return (
                      <option key={espacio.id} value={espacio.id}>
                        {espacio.nombre} (Aforo: {espacio.aforo} personas)
                      </option>
                    )
                  })}
                </select>
                {errores.espacioId && (
                  <div className="invalid-feedback">{errores.espacioId}</div>
                )}
              </div>

              {/* Ficha informativa del espacio seleccionado */}
              {espacioSeleccionado && (
                <div className="card-neutra p-3 mb-4 bg-light d-flex flex-row align-items-center gap-3">
                  <img
                    src={fotoDeEspacio(espacioSeleccionado)}
                    alt={espacioSeleccionado.nombre}
                    style={{ width: '84px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div className="small">
                    <h6 className="fw-semibold mb-1">{espacioSeleccionado.nombre}</h6>
                    <div className="text-muted">
                      <span className="me-3">
                        <i className="bi bi-people me-1"></i>Aforo máx: {espacioSeleccionado.aforo} personas
                      </span>
                      {espacioSeleccionado.horarioApertura && (
                        <span>
                          <i className="bi bi-clock me-1"></i>{espacioSeleccionado.horarioApertura} a {espacioSeleccionado.horarioCierre}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Fecha y Hora de inicio */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Fecha de la reserva <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    min={hoyStr}
                    className={`form-control ${errores.fecha ? 'is-invalid' : ''}`}
                    value={reserva.fecha}
                    onChange={manejarCambio}
                  />
                  {errores.fecha && (
                    <div className="invalid-feedback">{errores.fecha}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Hora de inicio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="time"
                    name="horaInicio"
                    className={`form-control ${errores.horaInicio ? 'is-invalid' : ''}`}
                    value={reserva.horaInicio}
                    onChange={manejarCambio}
                  />
                  {errores.horaInicio && (
                    <div className="invalid-feedback">{errores.horaInicio}</div>
                  )}
                  {espacioSeleccionado?.horarioApertura && (
                    <div className="form-text small text-muted">
                      Horario permitido: {espacioSeleccionado.horarioApertura} – {espacioSeleccionado.horarioCierre}
                    </div>
                  )}
                </div>
              </div>

              {/* Duración y Personas */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Duración estimada</label>
                  <select
                    name="duracionHoras"
                    className="form-select"
                    value={reserva.duracionHoras}
                    onChange={manejarCambio}
                  >
                    {[1, 2, 3, 4, 5, 6].map((h) => (
                      <option key={h} value={h}>
                        {h} hora{h > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Número de personas <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="numeroPersonas"
                    min="1"
                    max={espacioSeleccionado?.aforo ?? 100}
                    className={`form-control ${errores.numeroPersonas ? 'is-invalid' : ''}`}
                    value={reserva.numeroPersonas}
                    onChange={manejarCambio}
                  />
                  {errores.numeroPersonas && (
                    <div className="invalid-feedback">{errores.numeroPersonas}</div>
                  )}
                  {espacioSeleccionado && (
                    <div className="form-text small text-muted">
                      Capacidad máxima: {espacioSeleccionado.aforo} personas
                    </div>
                  )}
                </div>
              </div>

              {/* Nota opcional */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Nota o motivo (opcional)</label>
                <textarea
                  name="notaOpcional"
                  rows="2"
                  placeholder="Ej: Reunión familiar, estudio en grupo, entrenamiento personal..."
                  className="form-control"
                  value={reserva.notaOpcional}
                  onChange={manejarCambio}
                ></textarea>
              </div>

              {/* Botón de Enviar */}
              <div className="d-flex align-items-center gap-3">
                <button
                  type="submit"
                  className="btn btn-marca btn-lg"
                  disabled={enviando}
                >
                  <i className="bi bi-calendar-check me-2"></i>
                  {enviando ? 'Confirmando reserva...' : 'Confirmar reserva'}
                </button>
                <Link to="/catalogo" className="btn btn-fantasma">
                  Cancelar
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
