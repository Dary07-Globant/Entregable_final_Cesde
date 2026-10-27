import { clienteApi } from './clienteApi.js'

const RUTA = '/reservas'

// POST /reservas -> crear reserva (residentes y administrador)
export async function crearReserva(reserva) {
    const respuesta = await clienteApi.post(RUTA, reserva)
    return respuesta.data
}

// GET /reservas -> todas las reservas (solo administrador)
export async function listarReservas() {
    const respuesta = await clienteApi.get(RUTA)
    return respuesta.data
}

// GET /reservas/my-bookings -> reservas del usuario autenticado
export async function listarMisReservas() {
    const respuesta = await clienteApi.get(RUTA + '/my-bookings')
    return respuesta.data
}

// PATCH /reservas/{id}/cancel -> cancelar reserva
export async function cancelarReserva(id) {
    const respuesta = await clienteApi.patch(RUTA + '/' + id + '/cancel')
    return respuesta.data
}
