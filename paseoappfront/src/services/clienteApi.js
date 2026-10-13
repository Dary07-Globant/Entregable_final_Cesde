import axios from 'axios'

// Cliente de axios con la URL base del API
// La URL se puede cambiar con la variable VITE_API_URL en un archivo .env
export const clienteApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/paseoapi/v1',
    headers: { 'Content-Type': 'application/json' },
})
