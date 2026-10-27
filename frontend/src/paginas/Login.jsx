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

  // Si ya hay sesion activa, redirigir al Home
  if (estaLogueado) {
    return <Navigate to="/home" replace />
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setDatos((prev) => ({ ...prev, [name]: value }))
  }

  function llenarDemo(correo, contraseña) {
    setDatos({ correo, contraseña })
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const sesion = await iniciarSesion(datos.correo, datos.contraseña)
      guardarSesion(sesion)
      // Redireccion inteligente segun el rol tras iniciar sesion
      navegar(sesion.rol === 'ADMINISTRADOR' ? '/admin/reservas-globales' : '/home')
    } catch (errorApi) {
      setError(
        errorApi.response?.data?.message ||
        errorApi.message ||
        'No fue posible iniciar sesión. Verifica tus credenciales.'
      )
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-pantalla">
      {/* Panel izquierdo con imagen de la unidad */}
      <div
        className="auth-panel-visual"
        style={{ backgroundImage: `url(${fachada})` }}
      >
        <div className="d-flex align-items-center gap-2">
          <span className="logo-insignia">
            <i className="bi bi-buildings"></i>
          </span>
          <span className="fw-semibold fs-5 tracking-tight">Portal del Paraíso</span>
        </div>

        <div>
          <span className="insignia-ubicacion mb-3">
            <i className="bi bi-geo-alt me-1"></i>Sabaneta, Antioquia
          </span>
          <h2 className="display-6 fw-bold text-white mb-3">
            El confort de tu hogar, <br />ahora en tus manos.
          </h2>
          <p className="text-white-50 mb-0" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
            Gestiona y disfruta las zonas comunes de tu unidad residencial sin intermediarios:
            reserva piscina, gimnasio, BBQ o coworking con total tranquilidad.
          </p>
        </div>

        <div className="small text-white-50">
          © 2026 Portal del Paraíso · Unidad Residencial
        </div>
      </div>

      {/* Panel derecho con formulario sobrio y neutro */}
      <div className="auth-panel-formulario">
        <div className="auth-caja">
          <div className="mb-4">
            <div className="auth-insignia-sólida">
              <i className="bi bi-buildings"></i>
            </div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--color-texto)' }}>
              Iniciar sesión
            </h2>
            <p className="texto-suave mb-0">
              Ingresa tus datos para acceder a las zonas comunes de la unidad.
            </p>
          </div>

          {error && (
            <div className="alerta-relajante error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={manejarEnvio}>
            <div className="auth-input-grupo">
              <label>Correo electrónico</label>
              <div className="auth-input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  value={datos.correo}
                  onChange={manejarCambio}
                  required
                />
              </div>
            </div>

            <div className="auth-input-grupo mb-4">
              <label>Contraseña</label>
              <div className="auth-input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  name="contraseña"
                  placeholder="••••••••"
                  value={datos.contraseña}
                  onChange={manejarCambio}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-marca w-100 py-2 mb-3" disabled={enviando}>
              <i className="bi bi-box-arrow-in-right me-1"></i>
              {enviando ? 'Ingresando al portal...' : 'Ingresar al portal'}
            </button>
          </form>

          {/* Cuentas de demostración rápida */}
          <div className="p-3 bg-light rounded-3 border mb-4">
            <div className="small fw-semibold text-muted mb-2">
              <i className="bi bi-key me-1"></i>Accesos de demostración:
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-sm btn-claro"
                style={{ fontSize: '0.8rem' }}
                onClick={() => llenarDemo('residente@portal.com', 'residente123')}
              >
                <i className="bi bi-person me-1"></i>Residente
              </button>
              <button
                type="button"
                className="btn btn-sm btn-claro"
                style={{ fontSize: '0.8rem' }}
                onClick={() => llenarDemo('admin@portal.com', 'admin123')}
              >
                <i className="bi bi-shield-lock me-1"></i>Administrador
              </button>
            </div>
          </div>

          <p className="text-center texto-suave small mb-0">
            ¿No tienes cuenta aún?{' '}
            <Link to="/registro" className="auth-enlace">
              Crea tu cuenta aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
