// Fotos locales de los espacios comunes de la unidad.
// La clave es el nombre del espacio tal como esta registrado en la base de datos.
import piscina from '../assets/piscina-unidad.jpg'
import gym from '../assets/gym_unidad.jpg'
import bbq from '../assets/BBQ_unidad.jpg'
import cancha from '../assets/cancha_unidad.jpg'
import parque from '../assets/parque_unidad.jpg'
import parqueCanino from '../assets/parque_canino_unidad.jpg'
import coworking from '../assets/coworking_unidad.jpg'
import salon from '../assets/espacio_Unidad.jpg'

export const FOTOS_ESPACIOS = {
  'Piscina': piscina,
  'Gimnasio': gym,
  'BBQ': bbq,
  'Zona BBQ': bbq,
  'Cancha': cancha,
  'Cancha múltiple': cancha,
  'Parque': parque,
  'Zona húmeda': parque,
  'Parque canino': parqueCanino,
  'Parque Canino': parqueCanino,
  'Coworking': coworking,
  'Salón social': salon,
  'Salón Social': salon,
}

// Devuelve la foto local del espacio, o la fotoUrl del API si no hay coincidencia
export function fotoDeEspacio(espacio) {
  return FOTOS_ESPACIOS[espacio.nombre] || espacio.fotoUrl
}
