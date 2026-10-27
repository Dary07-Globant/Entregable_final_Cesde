import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { registrarUsuario } from '../services/servicioAuth.js'
import { useSesion } from '../contexto/ContextoSesion.jsx'

export function RegistroUsuario() {
  const navegar = useNavigate()
  const { guardarSesion } = useSesion()

  const [usuario, setUsuario] = useState({
    nombres: '',
    apartamento: '',
    torre: '',
    correo: '',
    contraseña: '',
    rol: '',
  })
  const [errores, setErrores] = useState({})
  const [errorApi, setErrorApi] = useState('')
  const [enviando, setEnviando] = useState(false)

  function manejarCambio(evento) {
    const { name, value } = evento.target
    setUsuario({ ...usuario, [name]: value })
  }

  function validar() {
    const nuevosErrores = {}
    if (usuario.nombres.trim() === '') {
      nuevosErrores.nombres = 'Los nombres son obligatorios'
    }
    if (!/^\S+@\S+\.\S+$/.test(usuario.correo)) {
      nuevosErrores.correo = 'Ingrese un correo válido'
    }
    if (usuario.contraseña.length < 6) {
      nuevosErrores.contraseña = 'La contraseña debe tener mínimo 6 caracteres'
    }
    if (usuario.rol === '') {
      nuevosErrores.rol = 'Seleccione un rol'
    }
    return nuevosErrores
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()

    const nuevosErrores = validar()
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) {
      return
    }

    setErrorApi('')
    setEnviando(true)
    try {
      // El backend registra el usuario y devuelve la sesion con token
      const sesion = await registrarUsuario(usuario)
      guardarSesion(sesion)
      navegar(sesion.rol === 'ADMINISTRADOR' ? '/admin/reservas-globales' : '/catalogo')
    } catch (error) {
      const mensaje = error.response?.data?.message
        || error.response?.data
        || 'No fue posible registrar el usuario'
      setErrorApi(typeof mensaje === 'string' ? mensaje : 'No fue posible registrar el usuario')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-fondo">
      <div className="auth-orbe auth-orbe-1"></div>
      <div className="auth-orbe auth-orbe-2"></div>
      <div className="auth-orbe auth-orbe-3"></div>

      <div className="auth-tarjeta auth-tarjeta-amplia">
        <div className="text-center mb-4">
          <div className="auth-insignia mb-3">
            <i className="bi bi-buildings-fill"></i>
          </div>
          <h1 className="h4 fw-bold mb-1">Portal del Paraíso</h1>
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            Unidad Residencial
          </p>
        </div>

        <div className="auth-divisor mb-4">Crea tu cuenta</div>

        {errorApi && <div className="auth-alerta mb-3"><i className="bi bi-exclamation-circle me-2"></i>{errorApi}</div>}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="auth-campo mb-3">
            <input
              type="text"
              name="nombres"
              placeholder=" "
              value={usuario.nombres}
              onChange={manejarCambio}
            />
            <label>Nombres completos</label>
            <i className="bi bi-person auth-icono"></i>
            {errores.nombres && <div className="auth-error">{errores.nombres}</div>}
          </div>

          <div className="row g-3 mb-1">
            <div className="col-6">
              <div className="auth-campo">
                <input
                  type="text"
                  name="apartamento"
                  placeholder=" "
                  value={usuario.apartamento}
                  onChange={manejarCambio}
                />
                <label>Apartamento</label>
                <i className="bi bi-house-door auth-icono"></i>
              </div>
            </div>
            <div className="col-6">
              <div className="auth-campo">
                <input
                  type="text"
                  name="torre"
                  placeholder=" "
                  value={usuario.torre}
                  onChange={manejarCambio}
                />
                <label>Torre</label>
                <i className="bi bi-building auth-icono"></i>
              </div>
            </div>
          </div>

          <div className="auth-campo my-3">
            <input
              type="email"
              name="correo"
              placeholder=" "
              autoComplete="email"
              value={usuario.correo}
              onChange={manejarCambio}
            />
            <label>Correo electrónico</label>
            <i className="bi bi-envelope auth-icono"></i>
            {errores.correo && <div className="auth-error">{errores.correo}</div>}
          </div>

          <div className="auth-campo mb-3">
            <input
              type="password"
              name="contraseña"
              placeholder=" "
              value={usuario.contraseña}
              onChange={manejarCambio}
            />
            <label>Contraseña (mínimo 6 caracteres)</label>
            <i className="bi bi-lock auth-icono"></i>
            {errores.contraseña && <div className="auth-error">{errores.contraseña}</div>}
          </div>

          <div className="mb-4">
            <p className="mb-2" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
              ¿Cómo usarás el portal?
            </p>
            <div className="auth-rol">
              <button
                type="button"
                className={`auth-rol-opcion ${usuario.rol === 'USUARIO' ? 'activa' : ''}`}
                onClick={() => setUsuario({ ...usuario, rol: 'USUARIO' })}
              >
                <i className="bi bi-person-badge"></i>
                Residente
              </button>
              <button
                type="button"
                className={`auth-rol-opcion ${usuario.rol === 'ADMINISTRADOR' ? 'activa' : ''}`}
                onClick={() => setUsuario({ ...usuario, rol: 'ADMINISTRADOR' })}
              >
                <i className="bi bi-shield-lock"></i>
                Administrador
              </button>
            </div>
            {errores.rol && <div className="auth-error mt-1" style={{ color: '#fecaca', fontSize: '0.82rem' }}>{errores.rol}</div>}
          </div>

          <button type="submit" className="auth-boton" disabled={enviando}>
            <i className="bi bi-person-plus me-2"></i>
            {enviando ? 'Registrando...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="text-center mt-4 mb-0" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link to="/login" className="auth-enlace">Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
