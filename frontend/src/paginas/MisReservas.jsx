import { useEffect, useState } from 'react'

import { listarMisReservas, cancelarReserva } from '../services/servicioReservas.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'

// Panel "Mis Reservas": historial del residente con cancelacion dinamica
export function MisReservas() {

    const [reservas, setReservas] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [reservaEnProceso, setReservaEnProceso] = useState(null)

    useEffect(function () {
        async function cargarReservas() {
            try {
                const datos = await listarMisReservas()
                setReservas(datos)
            } catch (error) {
                setError(error.response?.data?.message || 'No fue posible cargar tus reservas')
            } finally {
                setCargando(false)
            }
        }
        cargarReservas()
    }, [])

    async function confirmarCancelacion(id) {
        // Dialogo de confirmacion antes de cancelar
        if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) {
            return
        }

        setReservaEnProceso(id)
        try {
            const reservaCancelada = await cancelarReserva(id)
            // Actualizamos la UI sin recargar la pagina
            setReservas(function (reservasActuales) {
                return reservasActuales.map(function (reserva) {
                    return reserva.id === id ? reservaCancelada : reserva
                })
            })
        } catch (error) {
            alert(error.response?.data?.message || 'No fue posible cancelar la reserva')
        } finally {
            setReservaEnProceso(null)
        }
    }

    function pintarReserva(reserva) {
        const estaConfirmada = reserva.estado === 'CONFIRMADA'
        return (
            <div className="col-md-6" key={reserva.id}>
                <div className="card shadow-sm h-100">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title fw-bold mb-0">{reserva.espacioNombre}</h5>
                            {/* Indicador visual del estado de la reserva */}
                            {estaConfirmada
                                ? <span className="badge badge-estado confirmada">Confirmada</span>
                                : <span className="badge badge-estado cancelada">Cancelada</span>}
                        </div>

                        <ul className="list-unstyled small text-muted mb-3">
                            <li><i className="bi bi-calendar-event me-2"></i>{reserva.fecha}</li>
                            <li><i className="bi bi-clock me-2"></i>{reserva.horaInicio} · {reserva.duracionHoras} hora{reserva.duracionHoras > 1 ? 's' : ''}</li>
                            <li><i className="bi bi-people me-2"></i>{reserva.numeroPersonas} persona{reserva.numeroPersonas > 1 ? 's' : ''}</li>
                            {reserva.notaOpcional && <li><i className="bi bi-chat-left-text me-2"></i>{reserva.notaOpcional}</li>}
                        </ul>

                        {estaConfirmada && (
                            <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => confirmarCancelacion(reserva.id)}
                                disabled={reservaEnProceso === reserva.id}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                {reservaEnProceso === reserva.id ? 'Cancelando...' : 'Cancelar reserva'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container pagina-interna">
            <Navbar />

            <div className="encabezado-pagina mb-4">
                <span className="etiqueta-seccion">Historial</span>
                <h1 className="fw-bold mt-2 mb-1">Mis reservas</h1>
                <p className="texto-suave mb-0">Historial de reservas de tu apartamento.</p>
            </div>

            {cargando && <Spinner texto="Cargando reservas..." />}
            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && (
                reservas.length === 0
                    ? <div className="alert alert-info">Todavía no tienes reservas. ¡Haz tu primera reserva!</div>
                    : <section className="row g-4">
                        {reservas.map(pintarReserva)}
                    </section>
            )}
        </div>
    )
}
