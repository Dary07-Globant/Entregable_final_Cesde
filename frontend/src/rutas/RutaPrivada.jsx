import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../contexto/ContextoSesion.jsx'

// Deja pasar solo a usuarios logueados.
// <Outlet /> pinta la ruta hija que el usuario pidio.
export function RutaPrivada() {
    const { estaLogueado } = useSesion()

    if (!estaLogueado) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
