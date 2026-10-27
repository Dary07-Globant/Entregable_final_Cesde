import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProveedorSesion } from './contexto/ContextoSesion'
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

export function App() {
  return (
    <ProveedorSesion>
      <BrowserRouter>
        <Routes>
          {/* Rutas publicas: cualquiera puede entrar */}
          <Route path="/" element={<RegistroUsuario />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas privadas: solo usuarios logueados */}
          <Route element={<RutaPrivada />}>
            <Route path="/home" element={<Home />} />
            <Route path="/catalogo" element={<ListaEspacios />} />
            <Route path="/reservas" element={<RegistroReserva />} />
            <Route path="/mis-reservas" element={<MisReservas />} />

            {/* Rutas por rol: solo ADMINISTRADOR */}
            <Route element={<RutaPorRol rolesPermitidos={['ADMINISTRADOR']} />}>
              <Route path="/admin/nuevo-espacio" element={<RegistroEspacio />} />
              <Route path="/admin/reservas-globales" element={<ReservasGlobales />} />
            </Route>
          </Route>

          {/* Cualquier otra ruta */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorSesion>
  )
}
