import { clienteApi } from './clienteApi.js'

const RUTA = '/auth'

// POST /auth/login -> devuelve { id, nombres, correo, rol, token }
export async function iniciarSesion(correo, contraseña) {
    const respuesta = await clienteApi.post(RUTA + '/login', { correo, contraseña })
    return respuesta.data
}

// POST /auth/register -> registra el usuario y devuelve la sesion con token
export async function registrarUsuario(usuario) {
    const respuesta = await clienteApi.post(RUTA + '/register', usuario)
    return respuesta.data
}
