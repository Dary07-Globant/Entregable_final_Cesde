import { useState } from 'react'
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
    setEspacio({ ...espacio, [name]: type === 'checkbox' ? checked : value })
  }

  function validar() {
    const nuevosErrores = {}
    if (espacio.nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (espacio.categoria === '') {
      nuevosErrores.categoria = 'Seleccione una categoría'
    }
    if (espacio.aforo === '' || Number(espacio.aforo) <= 0) {
      nuevosErrores.aforo = 'El aforo debe ser un número mayor a 0'
    }
    if (espacio.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener mínimo 10 caracteres'
    }
    if (!/^https?:\/\/\S+$/.test(espacio.fotoUrl)) {
      nuevosErrores.fotoUrl = 'Ingrese una URL válida (http:// o https://)'
    }
    if (espacio.horarioApertura && espacio.horarioCierre && espacio.horarioCierre <= espacio.horarioApertura) {
      nuevosErrores.horarioCierre = 'El cierre debe ser posterior a la apertura'
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
      await crearEspacio({ ...espacio, aforo: Number(espacio.aforo) })
      setExito(true)
      // Limpiamos el formulario para registrar otro espacio
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
      setErrores({})
    } catch (error) {
      setErrorApi(error.response?.data?.message || 'No fue posible registrar el espacio')
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
            <h1 className="fw-bold mt-2 mb-1">Nuevo espacio común</h1>
            <p className="texto-suave mb-0">Completa la información de la zona común.</p>
          </div>

          {exito && (
            <div className="alert alert-success">
              <i className="bi bi-check-circle me-2"></i>¡Espacio registrado con éxito!
            </div>
          )}
          {errorApi && <div className="alert alert-danger">{errorApi}</div>}

          <form onSubmit={manejarEnvio} noValidate className="card p-4 shadow-sm">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Nombre</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Salón social"
                    className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                    value={espacio.nombre}
                    onChange={manejarCambio}
                  />
                  <div className="invalid-feedback">{errores.nombre}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Categoría</label>
                  <select
                    name="categoria"
                    className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                    value={espacio.categoria}
                    onChange={manejarCambio}
                  >
                    <option value="">Seleccione...</option>
                    <option value="DEPORTES">Deportes</option>
                    <option value="EVENTOS">Eventos</option>
                    <option value="RECREACION">Recreación</option>
                    <option value="BIENESTAR">Bienestar</option>
                  </select>
                  <div className="invalid-feedback">{errores.categoria}</div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Aforo</label>
                  <input
                    type="number"
                    name="aforo"
                    min="1"
                    placeholder="40"
                    className={`form-control ${errores.aforo ? 'is-invalid' : ''}`}
                    value={espacio.aforo}
                    onChange={manejarCambio}
                  />
                  <div className="invalid-feedback">{errores.aforo}</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Ubicación</label>
                  <input
                    type="text"
                    name="ubicacion"
                    placeholder="Torre A, primer piso"
                    className="form-control"
                    value={espacio.ubicacion}
                    onChange={manejarCambio}
                  />
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                name="descripcion"
                rows="3"
                placeholder="Describe el espacio..."
                className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
                value={espacio.descripcion}
                onChange={manejarCambio}
              />
              <div className="invalid-feedback">{errores.descripcion}</div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Foto (URL)</label>
              <input
                type="url"
                name="fotoUrl"
                placeholder="https://..."
                className={`form-control ${errores.fotoUrl ? 'is-invalid' : ''}`}
                value={espacio.fotoUrl}
                onChange={manejarCambio}
              />
              <div className="invalid-feedback">{errores.fotoUrl}</div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Horario de apertura</label>
                  <input
                    type="time"
                    name="horarioApertura"
                    className="form-control"
                    value={espacio.horarioApertura}
                    onChange={manejarCambio}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Horario de cierre</label>
                  <input
                    type="time"
                    name="horarioCierre"
                    className={`form-control ${errores.horarioCierre ? 'is-invalid' : ''}`}
                    value={espacio.horarioCierre}
                    onChange={manejarCambio}
                  />
                  <div className="invalid-feedback">{errores.horarioCierre}</div>
                </div>
              </div>
            </div>

            <div className="form-check form-switch mb-4">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="usoCompartido"
                name="usoCompartido"
                checked={espacio.usoCompartido}
                onChange={manejarCambio}
              />
              <label className="form-check-label fw-semibold" htmlFor="usoCompartido">
                Uso compartido (permite varias reservas simultáneas hasta el aforo)
              </label>
            </div>

            <button type="submit" className="btn btn-marca btn-lg" disabled={enviando}>
              <i className="bi bi-door-open me-2"></i>
              {enviando ? 'Guardando...' : 'Registrar espacio'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
