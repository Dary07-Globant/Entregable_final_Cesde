import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorSesion, useSesion } from './contexto/ContextoSesion'
import { RutaPrivada } from './rutas/RutaPrivada'
import { RutaPorRol } from './rutas/RutaPorRol'
import { RegistroUsuario } from './paginas/RegistroUsuario'
import { Login } from './paginas/Login'
import { Home } from './paginas/Home'
import { ListaEspacios } from './paginas/ListaEspacios'
import { RegistroEspacio } from './paginas/RegistroEspacio'
import { RegistroReserva } from './paginas/RegistroReserva'
import { MisReservas } from './paginas/MisReservas'
import { ReservasGlobales } from './paginas/ReservasGlobales'

function RedireccionRaiz() {
  const { estaLogueado, esAdministrador } = useSesion()
  if (!estaLogueado) {
    return <Navigate to="/login" replace />
  }
  return <Navigate to={esAdministrador ? "/admin/reservas-globales" : "/home"} replace />
}

export function App() {
  return (
    <ProveedorSesion>
      <BrowserRouter>
        <Routes>
          {/* Ruta raiz: redirige inteligentemente al Home o Login */}
          <Route path="/" element={<RedireccionRaiz />} />

          {/* Rutas publicas de acceso */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<RegistroUsuario />} />

          {/* Rutas privadas para residentes y administradores */}
          <Route element={<RutaPrivada />}>
            <Route path="/home" element={<Home />} />
            <Route path="/catalogo" element={<ListaEspacios />} />
            <Route path="/reservas" element={<RegistroReserva />} />
            <Route path="/mis-reservas" element={<MisReservas />} />

            {/* Rutas exclusivas para el rol ADMINISTRADOR */}
            <Route element={<RutaPorRol rolesPermitidos={['ADMINISTRADOR']} />}>
              <Route path="/admin/nuevo-espacio" element={<RegistroEspacio />} />
              <Route path="/admin/reservas-globales" element={<ReservasGlobales />} />
            </Route>
          </Route>

          {/* Cualquier otra ruta no existente */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorSesion>
  )
}
