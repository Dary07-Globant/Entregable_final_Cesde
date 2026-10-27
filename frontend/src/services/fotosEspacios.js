// Mapeo y resolucion inteligente de imagenes para los espacios comunes
import piscina from '../assets/piscina-unidad.jpg'
import gym from '../assets/gym_unidad.jpg'
import bbq from '../assets/BBQ_unidad.jpg'
import cancha from '../assets/cancha_unidad.jpg'
import parque from '../assets/parque_unidad.jpg'
import parqueCanino from '../assets/parque_canino_unidad.jpg'
import coworking from '../assets/coworking_unidad.jpg'
import salon from '../assets/espacio_Unidad.jpg'
import fachada from '../assets/fachada_unidad.jpg'

export const FOTOS_LOCALES = {
  piscina,
  gym,
  bbq,
  cancha,
  parque,
  parqueCanino,
  coworking,
  salon,
  fachada,
}

// Normaliza texto eliminando tildes y pasando a minusculas
function normalizar(texto) {
  if (!texto) return ''
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * Devuelve la foto adecuada para un espacio.
 * 1. Coincidencia por palabras clave en el nombre del espacio.
 * 2. Si el espacio tiene una fotoUrl valida (comienza por http), se usa.
 * 3. Si no, devuelve una foto local representativa por defecto.
 */
export function fotoDeEspacio(espacio) {
  if (!espacio) return fachada

  const nombre = normalizar(espacio.nombre || '')

  if (nombre.includes('piscin') || nombre.includes('humed') || nombre.includes('acuatic')) {
    return piscina
  }
  if (nombre.includes('gym') || nombre.includes('gimnasio') || nombre.includes('pesas') || nombre.includes('fitness')) {
    return gym
  }
  if (nombre.includes('bbq') || nombre.includes('asador') || nombre.includes('parrilla')) {
    return bbq
  }
  if (nombre.includes('cancha') || nombre.includes('futbol') || nombre.includes('baloncesto') || nombre.includes('deport')) {
    return cancha
  }
  if (nombre.includes('canin') || nombre.includes('perro') || nombre.includes('mascot')) {
    return parqueCanino
  }
  if (nombre.includes('infantil') || nombre.includes('nino') || nombre.includes('juego') || nombre.includes('parque')) {
    return parque
  }
  if (nombre.includes('cowork') || nombre.includes('trabajo') || nombre.includes('estudio')) {
    return coworking
  }
  if (nombre.includes('salon') || nombre.includes('social') || nombre.includes('evento') || nombre.includes('fiesta')) {
    return salon
  }

  // Si no coincidio con ninguna palabra clave y el espacio trae una fotoUrl en la BD
  if (espacio.fotoUrl && /^https?:\/\//i.test(espacio.fotoUrl)) {
    return espacio.fotoUrl
  }

  return salon
}
