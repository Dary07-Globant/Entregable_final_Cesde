import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PanelFormulario } from '../componentes/PanelFormulario'

const IMAGEN = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1400&q=80'

export function RegistroReserva() {
  const navegar = useNavigate()

  const [reserva, setReserva] = useState({
    fecha: '',
    tiempo: '',
  })
  const [errores, setErrores] = useState({})

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setReserva({ ...reserva, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    const hoy = new Date().toISOString().split('T')[0]
    if (reserva.fecha === '') {
      nuevosErrores.fecha = 'La fecha es obligatoria'
    } else if (reserva.fecha < hoy) {
      nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy'
    }
    if (reserva.tiempo === '') {
      nuevosErrores.tiempo = 'La hora es obligatoria'
    }
    return nuevosErrores
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length === 0) {
      console.log('Reserva registrada:', reserva)
      navegar('/home')
    }
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Aparta tu espacio"
      subtitulo="Elige la fecha y la hora, nosotros nos encargamos del resto."
      enlaceVolver="/home"
    >
      <h2 className="fw-bold mb-1">Nueva reserva</h2>
      <p className="text-muted mb-4">Indica cuándo quieres usar el espacio.</p>

      <form onSubmit={manejarEnvio} noValidate>
        <div className="mb-3">
          <label className="form-label fw-semibold">Fecha</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-calendar-event"></i></span>
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

        <div className="mb-4">
          <label className="form-label fw-semibold">Hora</label>
          <div className="input-group has-validation">
            <span className="input-group-text"><i className="bi bi-clock"></i></span>
            <input
              type="time"
              name="tiempo"
              className={`form-control ${errores.tiempo ? 'is-invalid' : ''}`}
              value={reserva.tiempo}
              onChange={manejarCambio}
            />
            <div className="invalid-feedback">{errores.tiempo}</div>
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100">
          <i className="bi bi-calendar-check me-2"></i>Confirmar reserva
        </button>
      </form>
    </PanelFormulario>
  )
}
