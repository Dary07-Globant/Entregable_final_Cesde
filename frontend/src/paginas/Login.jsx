import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { iniciarSesion } from '../services/servicioAuth.js'
import { useSesion } from '../contexto/ContextoSesion.jsx'
import fachada from '../assets/fachada_unidad.jpg'

export function Login() {
  const navegar = useNavigate()
  const { estaLogueado, guardarSesion } = useSesion()

  const [datos, setDatos] = useState({ correo: '', contraseña: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Si ya hay sesion no tiene sentido ver el login
  if (estaLogueado) {
    return <Navigate to="/catalogo" replace />
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
      const sesion = await iniciarSesion(datos.correo, datos.contraseña)
      guardarSesion(sesion)
      // Redireccion segun el rol tras iniciar sesion
      navegar(sesion.rol === 'ADMINISTRADOR' ? '/admin/reservas-globales' : '/catalogo')
    } catch (errorApi) {
      setError(errorApi.response?.data?.message || errorApi.message || 'No fue posible iniciar sesión')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-fondo-imagen">
      {/* Panel izquierdo: fachada de la unidad */}
      <div className="auth-panel-foto" style={{ backgroundImage: `url(${fachada})` }}>
        <div>
          <div className="auth-marca-mini mb-3">
            <i className="bi bi-buildings-fill fs-5"></i>
            Portal del Paraíso · Unidad Residencial
          </div>
          <h2 className="mb-3">Tu hogar, <br />a un solo clic de distancia.</h2>
          <p className="mb-0">
            Reserva la piscina, el gimnasio o el BBQ de tu unidad residencial sin llamadas ni formatos en papel.
          </p>
        </div>
      </div>

      {/* Panel derecho: formulario sobrio */}
      <div className="auth-fondo-serio">
        <div className="auth-tarjeta" style={{ maxWidth: '420px' }}>
          <div className="text-center mb-4">
            <div className="auth-insignia mb-3">
              <i className="bi bi-buildings-fill"></i>
            </div>
            <h1 className="h4 fw-bold mb-1">Portal del Paraíso</h1>
            <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
              Unidad Residencial
            </p>
          </div>

          <div className="auth-divisor mb-4">Bienvenido de nuevo</div>

          {error && <div className="auth-alerta mb-3"><i className="bi bi-exclamation-circle me-2"></i>{error}</div>}

          <form onSubmit={manejarEnvio}>
            <div className="auth-campo mb-3">
              <input
                type="email"
                name="correo"
                placeholder=" "
                autoComplete="email"
                value={datos.correo}
                onChange={manejarCambio}
                required
              />
              <label>Correo electrónico</label>
              <i className="bi bi-envelope auth-icono"></i>
            </div>

            <div className="auth-campo mb-4">
              <input
                type="password"
                name="contraseña"
                placeholder=" "
                value={datos.contraseña}
                onChange={manejarCambio}
                required
              />
              <label>Contraseña</label>
              <i className="bi bi-lock auth-icono"></i>
            </div>

            <button type="submit" className="auth-boton" disabled={enviando}>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center mt-4 mb-0" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
            ¿No tienes cuenta? <Link to="/" className="auth-enlace">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
