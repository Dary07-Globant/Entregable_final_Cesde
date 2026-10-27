import axios from 'axios'

// Clave donde guardamos la sesion (token + usuario) en el navegador
export const CLAVE_SESION = 'sesionPortalParaiso'

// Cliente de axios con la URL base del API
// La URL se puede cambiar con la variable VITE_API_URL en un archivo .env
export const clienteApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/portalapi/v1',
    headers: { 'Content-Type': 'application/json' },
})

// En cada peticion adjuntamos el token JWT si hay sesion guardada
clienteApi.interceptors.request.use((config) => {
    try {
        const texto = localStorage.getItem(CLAVE_SESION)
        if (texto) {
            const sesion = JSON.parse(texto)
            if (sesion?.token) {
                clienteApi.defaults.headers.common['Authorization'] = 'Bearer ' + sesion.token
                config.headers['Authorization'] = 'Bearer ' + sesion.token
            }
        }
    } catch {
        // Si no hay sesion seguimos sin token
    }
    return config
})

// Si el API responde 401 (sesion expirada o invalida) limpiamos la sesion
// y enviamos al usuario al login en lugar de mostrar errores confusos
clienteApi.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem(CLAVE_SESION)
            if (!window.location.pathname.endsWith('/login')) {
                window.location.replace('/login')
            }
        }
        return Promise.reject(error)
    }
)
