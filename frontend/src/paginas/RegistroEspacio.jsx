import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from '../componentes/Navbar.jsx'
import { crearEspacio } from '../services/servicioEspacios.js'

export function RegistroEspacio() {
  const [espacio, setEspacio] = useState({
    nombre: '',
    categoria: '',
    aforo: '',
    descripcion: '',
    fotoUrl: '',
    horarioApertura: '',
    horarioCierre: '',
    ubicacion: '',
    usoCompartido: false,
  })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [exito, setExito] = useState(false)
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value, type, checked } = evento.target
    setEspacio((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validar() {
    const nuevosErrores = {}
    if (!espacio.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre del espacio es obligatorio'
    }
    if (!espacio.categoria) {
      nuevosErrores.categoria = 'Seleccione una categoría'
    }
    if (!espacio.aforo || Number(espacio.aforo) <= 0) {
      nuevosErrores.aforo = 'El aforo debe ser mayor a 0'
    }
    if (espacio.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 10 caracteres'
    }
    if (espacio.fotoUrl && !/^https?:\/\/\S+/i.test(espacio.fotoUrl)) {
      nuevosErrores.fotoUrl = 'Ingrese una URL válida (http:// o https://)'
    }
    if (espacio.horarioApertura && espacio.horarioCierre && espacio.horarioCierre <= espacio.horarioApertura) {
      nuevosErrores.horarioCierre = 'La hora de cierre debe ser posterior a la de apertura'
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
      await crearEspacio({
        ...espacio,
        aforo: Number(espacio.aforo),
      })
      setExito(true)
      setEspacio({
        nombre: '',
        categoria: '',
        aforo: '',
        descripcion: '',
        fotoUrl: '',
        horarioApertura: '',
        horarioCierre: '',
        ubicacion: '',
        usoCompartido: false,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      const msj = error.response?.data?.message || 'No fue posible registrar la zona común'
      setErrorApi(msj)
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
            <span className="etiqueta-seccion">Administración</span>
            <h1 className="fw-bold mt-2 mb-1">Registrar nueva zona común</h1>
            <p className="texto-suave mb-0">
              Agrega una nueva instalación para disfrute de todos los residentes.
            </p>
          </div>

          {exito && (
            <div className="alerta-relajante exito mb-4">
              <i className="bi bi-check-circle-fill fs-5"></i>
              <div className="d-flex justify-content-between align-items-center w-100 flex-wrap gap-2">
                <span>¡Zona común registrada exitosamente! Ya está visible en el catálogo.</span>
                <Link to="/catalogo" className="btn btn-marca btn-sm">
                  Ver en catálogo
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

          <form onSubmit={manejarEnvio} noValidate className="card-neutra p-4 p-md-5">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Nombre del espacio <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Ej: Salón de yoga, Terraza mirador..."
                  className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                  value={espacio.nombre}
                  onChange={manejarCambio}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Categoría <span className="text-danger">*</span>
                </label>
                <select
                  name="categoria"
                  className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                  value={espacio.categoria}
                  onChange={manejarCambio}
                >
                  <option value="">Selecciona una categoría...</option>
                  <option value="RECREACION">Recreación</option>
                  <option value="DEPORTES">Deportes</option>
                  <option value="EVENTOS">Eventos</option>
                  <option value="BIENESTAR">Bienestar</option>
                </select>
                {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
              </div>
            </div>

            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Aforo máximo de personas <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  name="aforo"
                  min="1"
                  placeholder="Ej: 30"
                  className={`form-control ${errores.aforo ? 'is-invalid' : ''}`}
                  value={espacio.aforo}
                  onChange={manejarCambio}
                />
                {errores.aforo && <div className="invalid-feedback">{errores.aforo}</div>}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Ubicación física</label>
                <input
                  type="text"
                  name="ubicacion"
                  placeholder="Ej: Torre 2, Piso 1"
                  className="form-control"
                  value={espacio.ubicacion}
                  onChange={manejarCambio}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Descripción detallada <span className="text-danger">*</span>
              </label>
              <textarea
                name="descripcion"
                rows="3"
                placeholder="Describe las características, equipamiento y normas básicas del espacio..."
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                value={espacio.descripcion}
                onChange={manejarCambio}
              />
              {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Foto de referencia (URL)</label>
              <input
                type="url"
                name="fotoUrl"
                placeholder="https://images.unsplash.com/..."
                className={`form-control ${errores.fotoUrl ? 'is-invalid' : ''}`}
                value={espacio.fotoUrl}
                onChange={manejarCambio}
              />
              <div className="form-text small text-muted">
                Opcional. Si se deja vacía o no carga, se usará automáticamente la foto local acorde al nombre del espacio.
              </div>
              {errores.fotoUrl && <div className="invalid-feedback">{errores.fotoUrl}</div>}
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Horario de apertura</label>
                <input
                  type="time"
                  name="horarioApertura"
                  className="form-control"
                  value={espacio.horarioApertura}
                  onChange={manejarCambio}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Horario de cierre</label>
                <input
                  type="time"
                  name="horarioCierre"
                  className={`form-control ${errores.horarioCierre ? 'is-invalid' : ''}`}
                  value={espacio.horarioCierre}
                  onChange={manejarCambio}
                />
                {errores.horarioCierre && <div className="invalid-feedback">{errores.horarioCierre}</div>}
              </div>
            </div>

            <div className="p-3 bg-light rounded-3 mb-4 border">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="usoCompartidoSwitch"
                  name="usoCompartido"
                  checked={espacio.usoCompartido}
                  onChange={manejarCambio}
                />
                <label className="form-check-label fw-semibold ms-2" htmlFor="usoCompartidoSwitch">
                  Permitir uso compartido simultáneo
                </label>
                <div className="form-text small text-muted ms-2 mt-1">
                  Si se activa, varios residentes pueden reservar al mismo tiempo hasta agotar el aforo máximo (ideal para piscinas, gimnasios o coworking). Si está desactivado, el espacio es de uso exclusivo por reserva.
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <button type="submit" className="btn btn-marca btn-lg" disabled={enviando}>
                <i className="bi bi-plus-circle me-2"></i>
                {enviando ? 'Guardando espacio...' : 'Guardar y publicar espacio'}
              </button>
              <Link to="/catalogo" className="btn btn-fantasma">
                Volver al catálogo
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
