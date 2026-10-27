import { clienteApi } from './clienteApi.js'

const RUTA = '/espacios'

// GET /espacios -> lista de espacios activos
export async function listarEspacios() {
    const respuesta = await clienteApi.get(RUTA)
    return respuesta.data
}

// POST /espacios -> crear espacio (solo administrador)
export async function crearEspacio(espacio) {
    const respuesta = await clienteApi.post(RUTA, espacio)
    return respuesta.data
}

// PUT /espacios/{id} -> modificar espacio (solo administrador)
export async function modificarEspacio(id, espacio) {
    const respuesta = await clienteApi.put(RUTA + '/' + id, espacio)
    return respuesta.data
}
