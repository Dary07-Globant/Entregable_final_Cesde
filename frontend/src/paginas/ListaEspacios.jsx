import { useEffect, useState } from 'react'

import { listarEspacios } from '../services/servicioEspacios.js'
import { TarjetaEspacio } from '../componentes/TarjetaEspacio.jsx'
import { Spinner } from '../componentes/Spinner.jsx'
import { Navbar } from '../componentes/Navbar.jsx'

// Catalogo de espacios comunes: tarjetas con datos reales del API
export function ListaEspacios() {

    const [espacios, setEspacios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')

    useEffect(function () {
        async function cargarEspacios() {
            try {
                const datos = await listarEspacios()
                setEspacios(datos)
            } catch (error) {
                setError(error.response?.data?.message || 'No fue posible cargar los espacios')
            } finally {
                setCargando(false)
            }
        }
        cargarEspacios()
    }, [])

    function pintarEspacio(espacio) {
        return (
            <div className="col-md-4" key={espacio.id}>
                <TarjetaEspacio espacio={espacio} />
            </div>
        )
    }

    return (
        <div className="container pagina-interna">
            <Navbar />

            <div className="encabezado-pagina mb-4">
                <span className="etiqueta-seccion">Catálogo</span>
                <h1 className="fw-bold mt-2 mb-1">Zonas comunes</h1>
                <p className="texto-suave mb-0">Elige un espacio y reserva tu momento.</p>
            </div>

            {cargando && <Spinner texto="Cargando espacios..." />}
            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && (
                espacios.length === 0
                    ? <div className="alert alert-info">Todavía no hay espacios registrados.</div>
                    : <section className="row g-4 mb-5">
                        {espacios.map(pintarEspacio)}
                    </section>
            )}
        </div>
    )
}
