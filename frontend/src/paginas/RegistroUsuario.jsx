import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registrarUsuario } from '../services/servicioAuth.js'
import { useSesion } from '../contexto/ContextoSesion.jsx'
import fachada from '../assets/fachada_unidad.jpg'

export function RegistroUsuario() {
  const navegar = useNavigate()
  const { guardarSesion } = useSesion()

  const [usuario, setUsuario] = useState({
    nombres: '',
    apartamento: '',
    torre: '',
    correo: '',
    contraseña: '',
    rol: 'USUARIO',
  })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setUsuario((prev) => ({ ...prev, [name]: value }))
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function validar() {
    const nuevosErrores = {}
    if (!usuario.nombres.trim()) {
      nuevosErrores.nombres = 'Los nombres son obligatorios'
    }
    if (!/^\S+@\S+\.\S+$/.test(usuario.correo)) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido'
    }
    if (usuario.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener mínimo 6 caracteres'
    }
    if (!usuario.rol) {
      nuevosErrores.rol = 'Selecciona un rol'
    }
    return nuevosErrores
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorApi('')

    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setEnviando(true)
    try {
      const sesion = await registrarUsuario(usuario)
      guardarSesion(sesion)
      navegar(sesion.rol === 'ADMINISTRADOR' ? '/admin/reservas-globales' : '/home')
    } catch (error) {
      const mensaje =
        error.response?.data?.message ||
        error.response?.data ||
        'No fue posible registrar el usuario. Es posible que el correo ya esté en uso.'
      setErrorApi(typeof mensaje === 'string' ? mensaje : 'Error al registrar la cuenta.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-pantalla">
      {/* Panel visual izquierdo */}
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
            <i className="bi bi-houses me-1"></i>Comunidad Residencial
          </span>
          <h2 className="display-6 fw-bold text-white mb-3">
            Únete a la convivencia digital de tu unidad.
          </h2>
          <p className="text-white-50 mb-0" style={{ maxWidth: '420px', lineHeight: '1.6' }}>
            Crea tu perfil como residente para apartar fechas, verificar disponibilidad en tiempo real y disfrutar de los espacios comunes con total comodidad.
          </p>
        </div>

        <div className="small text-white-50">
          Portal del Paraíso · Sabaneta, Antioquia
        </div>
      </div>

      {/* Formulario derecho */}
      <div className="auth-panel-formulario">
        <div className="auth-caja auth-caja-amplia">
          <div className="mb-4">
            <div className="auth-insignia-sólida">
              <i className="bi bi-person-plus"></i>
            </div>
            <h2 className="fw-bold mb-1" style={{ color: 'var(--color-texto)' }}>
              Crear cuenta
            </h2>
            <p className="texto-suave mb-0">
              Registra tus datos como residente o administrador de la unidad.
            </p>
          </div>

          {errorApi && (
            <div className="alerta-relajante error">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span>{errorApi}</span>
            </div>
          )}

          <form onSubmit={manejarEnvio} noValidate>
            <div className="auth-input-grupo">
              <label>Nombres completos <span className="text-danger">*</span></label>
              <div className="auth-input-wrapper">
                <i className="bi bi-person"></i>
                <input
                  type="text"
                  name="nombres"
                  placeholder="Ej: Laura Gómez Pérez"
                  value={usuario.nombres}
                  onChange={manejarCambio}
                />
              </div>
              {errores.nombres && <div className="auth-input-error">{errores.nombres}</div>}
            </div>

            <div className="row g-2">
              <div className="col-6">
                <div className="auth-input-grupo">
                  <label>Torre</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-building"></i>
                    <input
                      type="text"
                      name="torre"
                      placeholder="Ej: Torre 1"
                      value={usuario.torre}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="auth-input-grupo">
                  <label>Apartamento</label>
                  <div className="auth-input-wrapper">
                    <i className="bi bi-door-closed"></i>
                    <input
                      type="text"
                      name="apartamento"
                      placeholder="Ej: 304"
                      value={usuario.apartamento}
                      onChange={manejarCambio}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="auth-input-grupo">
              <label>Correo electrónico <span className="text-danger">*</span></label>
              <div className="auth-input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  type="email"
                  name="correo"
                  placeholder="ejemplo@correo.com"
                  autoComplete="email"
                  value={usuario.correo}
                  onChange={manejarCambio}
                />
              </div>
              {errores.correo && <div className="auth-input-error">{errores.correo}</div>}
            </div>

            <div className="auth-input-grupo">
              <label>Contraseña <span className="text-danger">*</span></label>
              <div className="auth-input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  type="password"
                  name="contraseña"
                  placeholder="Mínimo 6 caracteres"
                  value={usuario.contraseña}
                  onChange={manejarCambio}
                />
              </div>
              {errores.contraseña && <div className="auth-input-error">{errores.contraseña}</div>}
            </div>

            <div className="mb-4">
              <label className="d-block small text-muted mb-2">Rol en la unidad:</label>
              <div className="auth-selector-rol">
                <button
                  type="button"
                  className={`auth-rol-btn ${usuario.rol === 'USUARIO' ? 'activo' : ''}`}
                  onClick={() => setUsuario((prev) => ({ ...prev, rol: 'USUARIO' }))}
                >
                  <i className="bi bi-person-badge"></i>
                  <span>Residente</span>
                </button>
                <button
                  type="button"
                  className={`auth-rol-btn ${usuario.rol === 'ADMINISTRADOR' ? 'activo' : ''}`}
                  onClick={() => setUsuario((prev) => ({ ...prev, rol: 'ADMINISTRADOR' }))}
                >
                  <i className="bi bi-shield-lock"></i>
                  <span>Administrador</span>
                </button>
              </div>
              {errores.rol && <div className="auth-input-error">{errores.rol}</div>}
            </div>

            <button type="submit" className="btn btn-marca w-100 py-2 mb-3" disabled={enviando}>
              <i className="bi bi-check-lg me-1"></i>
              {enviando ? 'Creando cuenta...' : 'Crear mi cuenta'}
            </button>
          </form>

          <p className="text-center texto-suave small mb-0">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="auth-enlace">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
