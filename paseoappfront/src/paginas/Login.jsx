import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { iniciarSesion } from '../services/servicioAuth.js'
import { useSesion } from '../contexto/ContextoSesion.jsx'

import { PanelFormulario } from '../componentes/PanelFormulario'

const IMAGEN = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=80'

export function Login() {
  const navegar = useNavigate()
  const { estaLogueado, guardarSesion } = useSesion()

  const [datos, setDatos] = useState({ correo: '', contraseña: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesion no tiene sentido ver el login
  if (estaLogueado) {
    return <Navigate to="/home" replace />
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos({ ...datos, [name]: value })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const usuario = await iniciarSesion(datos.correo, datos.contraseña)
      guardarSesion(usuario)
      navegar('/home')
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'No fue posible iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PanelFormulario
      imagen={IMAGEN}
      titulo="Tu unidad residencial, en un solo lugar"
      subtitulo="Reserva zonas comunes y administra los espacios de tu conjunto en Sabaneta."
    >
      <h2 className="fw-bold mb-1">Iniciar sesión</h2>
      <p className="text-muted mb-4">Ingresa para reservar o administrar espacios.</p>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={manejarEnvio}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Correo</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-envelope"></i></span>
            <input
              type="email"
              name="correo"
              placeholder="correo@ejemplo.com"
              className="form-control"
              value={datos.correo}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Contraseña</label>
          <div className="input-group">
            <span className="input-group-text"><i className="bi bi-lock"></i></span>
            <input
              type="password"
              name="contraseña"
              className="form-control"
              value={datos.contraseña}
              onChange={manejarCambio}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-marca btn-lg w-100" disabled={enviando}>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <p className="text-center text-muted mt-4 mb-0">
        ¿No tienes cuenta? <Link to="/">Regístrate</Link>
      </p>
    </PanelFormulario>
  )
}
