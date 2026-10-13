import { createContext, useContext, useState } from 'react'

// 1. Creamos el contexto: una "caja" que cualquier componente puede abrir
const ContextoSesion = createContext(null)

const CLAVE = 'sesionPaseoApp'

// Lee la sesion guardada en el navegador (si recargo la pagina no se pierde)
function leerSesionGuardada() {
    try {
        const texto = localStorage.getItem(CLAVE)
        return texto ? JSON.parse(texto) : null
    } catch {
        return null
    }
}

// 2. El proveedor envuelve la app y guarda quien esta logueado
export function ProveedorSesion({ children }) {

    const [usuario, setUsuario] = useState(leerSesionGuardada)

    function guardarSesion(usuarioLogueado) {
        localStorage.setItem(CLAVE, JSON.stringify(usuarioLogueado))
        setUsuario(usuarioLogueado)
    }

    function cerrarSesion() {
        localStorage.removeItem(CLAVE)
        setUsuario(null)
    }

    // Lo que compartimos con toda la aplicacion
    const valor = {
        usuario,
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
