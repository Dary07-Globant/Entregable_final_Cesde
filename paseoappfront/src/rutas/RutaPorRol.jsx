import { Navigate, Outlet } from 'react-router-dom'
import { useSesion } from '../contexto/ContextoSesion.jsx'

// Deja pasar solo si el rol del usuario esta en la lista de roles permitidos.
// Ejemplo: <RutaPorRol rolesPermitidos={['ADMINISTRADOR']} />
export function RutaPorRol({ rolesPermitidos }) {
    const { usuario } = useSesion()

    if (!usuario) {
        return <Navigate to="/login" replace />
    }

    if (!rolesPermitidos.includes(usuario.rol)) {
        return <Navigate to="/home" replace />
    }

    return <Outlet />
}
