import { listarUsuarios } from './servicioUsuarios.js'

// OJO: el backend todavia no tiene un endpoint de login.
// Por ahora buscamos el usuario por correo en la lista de usuarios.
// Esto NO valida la contraseña (el API no la devuelve, y esta bien que no lo haga).
// Cuando exista POST /usuarios/login solo hay que cambiar esta funcion:
//
//   const respuesta = await clienteApi.post('/usuarios/login', { correo, contraseña })
//   return respuesta.data
//
export async function iniciarSesion(correo, contraseña) {
    const usuarios = await listarUsuarios()

    function tieneElMismoCorreo(usuario) {
        return usuario.correo.toLowerCase() === correo.toLowerCase()
    }

    const usuarioEncontrado = usuarios.find(tieneElMismoCorreo)

    if (!usuarioEncontrado) {
        throw new Error('Correo o contraseña incorrectos')
    }

    return usuarioEncontrado
}
