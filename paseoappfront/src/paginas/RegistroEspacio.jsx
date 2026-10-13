import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PanelFormulario } from '../componentes/PanelFormulario'

const IMAGEN = 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1400&q=80'

export function RegistroEspacio() {
  const navegar = useNavigate()

  const [espacio, setEspacio] = useState({
    nombre: '',
    descripcion: '',
    foto: '',
    aforo: '',
  })
  const [errores, setErrores] = useState({})

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setEspacio({ ...espacio, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    if (espacio.nombre.trim() === '') {
      nuevosErrores.nombre = 'El nombre es obligatorio'
    }
    if (espacio.descripcion.trim().length < 10) {
      nuevosErrores.descripcion = 'La descripción debe tener mínimo 10 caracteres'
    }
    if (!/^https?:\/\/\S+$/.test(espacio.foto)) {
      nuevosErrores.foto = 'Ingrese una URL válida (http:// o https://)'
    }
    if (espacio.aforo === '' || Number(espacio.aforo) <= 0) {
      nuevosErrores.aforo = 'El aforo debe ser un número mayor a 0'
    }
    return nuevosErrores
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Espacio registrado:', { ...espacio, aforo: Number(espacio.aforo) })
      navegar('/home')
    }
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Registra una zona común"
      subtitulo="Piscina, salón social, gimnasio, BBQ... cada espacio con su foto y aforo."
      enlaceVolver="/home"
    >
      <h2 className="fw-bold mb-1">Nuevo espacio</h2>
      <p className="text-muted mb-4">Completa la información del espacio.</p>

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Nombre</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-door-open"></i></span>
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

        <div className="mb-3">
          <label className="form-label fw-semibold">Descripción</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-card-text"></i></span>
            <textarea
              name="descripcion"
              rows="3"
              placeholder="Describe el espacio y sus condiciones de uso"
              className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
              value={espacio.descripcion}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.descripcion}</div>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Foto (URL)</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-image"></i></span>
            <input
              type="url"
              name="foto"
              placeholder="https://..."
              className={`form-control ${errores.foto ? 'is-invalid' : ''}`}
              value={espacio.foto}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.foto}</div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Aforo</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-people"></i></span>
            <input
              type="number"
              name="aforo"
              min="1"
              placeholder="Cantidad máxima de personas"
              className={`form-control ${errores.aforo ? 'is-invalid' : ''}`}
              value={espacio.aforo}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.aforo}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100">
          <i className="bi bi-save me-2"></i>Guardar espacio
        </button>
      </form>
    </PanelFormulario>
  )
}
