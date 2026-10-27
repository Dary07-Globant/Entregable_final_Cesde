import { createContext, useContext, useState } from 'react'
import { CLAVE_SESION } from '../services/clienteApi.js'

// 1. Creamos el contexto: una "caja" que cualquier componente puede abrir
const ContextoSesion = createContext(null)

// Lee la sesion guardada en el navegador (si recargo la pagina no se pierde)
function leerSesionGuardada() {
    try {
        const texto = localStorage.getItem(CLAVE_SESION)
        return texto ? JSON.parse(texto) : null
    } catch {
        return null
    }
}

// 2. El proveedor envuelve la app y guarda quien esta logueado
export function ProveedorSesion({ children }) {

    const [usuario, setUsuario] = useState(leerSesionGuardada)

    function guardarSesion(sesion) {
        // La sesion incluye el token JWT que devuelve el backend
        localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
        setUsuario(sesion)
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE_SESION)
        setUsuario(null)
    }

    // Lo que compartimos con toda la aplicacion
    const valor = {
        usuario,
        token: usuario?.token ?? null,
        estaLogueado: usuario !== null,
        esAdministrador: usuario?.rol === 'ADMINISTRADOR',
        guardarSesion,
        cerrarSesion,
    }

    return (
        <ContextoSesion.Provider value={valor}>
            {children}
        </ContextoSesion.Provider>
    )
}

// 3. Hook para usar la sesion desde cualquier componente
export function useSesion() {
    return useContext(ContextoSesion)
}
