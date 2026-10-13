import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorSesion } from './contexto/ContextoSesion'
import { RutaPrivada } from './rutas/RutaPrivada'
import { RutaPorRol } from './rutas/RutaPorRol'
import { RegistroUsuario } from './paginas/RegistroUsuario'
import { Login } from './paginas/Login'
import { Home } from './paginas/Home'
import { RegistroEspacio } from './paginas/RegistroEspacio'
import { RegistroReserva } from './paginas/RegistroReserva'
import {ListaEspacios} from './paginas/ListaEspacios'

export function App() {
  return (
    <ProveedorSesion>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas: cualquiera puede entrar */}
          <Route path="/" element={<RegistroUsuario />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas: solo usuarios logueados */}
          <Route element={<RutaPrivada />}>
            <Route path="/home" element={<Home />} />
            <Route path="/reservas" element={<RegistroReserva />} />
            <Route path="/listaespacios" element={<ListaEspacios />} />

            {/* Rutas por rol: solo ADMINISTRADOR */}
            <Route element={<RutaPorRol rolesPermitidos={['ADMINISTRADOR']} />}>
              <Route path="/espacios" element={<RegistroEspacio />} />
            </Route>
          </Route>

          {/* Cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorSesion>
  )
}
