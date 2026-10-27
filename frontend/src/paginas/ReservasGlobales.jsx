import { useEffect, useMemo, useState } from 'react'

import { listarReservas, cancelarReserva } from '../services/servicioReservas.js'
import { listarEspacios } from '../services/servicioEspacios.js'
import { Navbar } from '../componentes/Navbar.jsx'
import { Spinner } from '../componentes/Spinner.jsx'

// Panel de gestion de reservas (vista admin): todas las reservas de la unidad
// con filtros por fecha y espacio
export function ReservasGlobales() {

    const [reservas, setReservas] = useState([])
    const [espacios, setEspacios] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [reservaEnProceso, setReservaEnProceso] = useState(null)

    // Filtros
    const [filtroFecha, setFiltroFecha] = useState('')
    const [filtroEspacio, setFiltroEspacio] = useState('')

    useEffect(function () {
        async function cargarDatos() {
            try {
                const [datosReservas, datosEspacios] = await Promise.all([
                    listarReservas(),
                    listarEspacios(),
                ])
                setReservas(datosReservas)
                setEspacios(datosEspacios)
            } catch (error) {
                setError(error.response?.data?.message || 'No fue posible cargar las reservas')
            } finally {
                setCargando(false)
            }
        }
        cargarDatos()
    }, [])

    async function confirmarCancelacion(id) {
        if (!window.confirm('¿Seguro que quieres cancelar esta reserva?')) {
            return
        }

        setReservaEnProceso(id)
        try {
            const reservaCancelada = await cancelarReserva(id)
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

    // Aplicamos los filtros en memoria
    const reservasFiltradas = useMemo(function () {
        return reservas.filter(function (reserva) {
            const coincideFecha = filtroFecha === '' || reserva.fecha === filtroFecha
            const coincideEspacio = filtroEspacio === '' || reserva.espacioId === filtroEspacio
            return coincideFecha && coincideEspacio
        })
    }, [reservas, filtroFecha, filtroEspacio])

    function pintarReserva(reserva) {
        const estaConfirmada = reserva.estado === 'CONFIRMADA'
        return (
            <tr key={reserva.id}>
                <td>{reserva.fecha}</td>
                <td>{reserva.horaInicio}</td>
                <td className="fw-semibold">{reserva.espacioNombre}</td>
                <td>{reserva.usuarioNombre}</td>
                <td>{reserva.numeroPersonas}</td>
                <td>
                    {estaConfirmada
                        ? <span className="badge badge-estado confirmada">Confirmada</span>
                        : <span className="badge badge-estado cancelada">Cancelada</span>}
                </td>
                <td>
                    {estaConfirmada && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => confirmarCancelacion(reserva.id)}
                            disabled={reservaEnProceso === reserva.id}
                        >
                            <i className="bi bi-x-circle me-1"></i>Cancelar
                        </button>
                    )}
                </td>
            </tr>
        )
    }

    return (
        <div className="container pagina-interna">
            <Navbar />

            <div className="encabezado-pagina mb-4">
                <span className="etiqueta-seccion">Administración</span>
                <h1 className="fw-bold mt-2 mb-1">Reservas de la unidad</h1>
                <p className="texto-suave mb-0">Vista global de todas las reservas.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {cargando
                ? <Spinner texto="Cargando reservas..." />
                : <>
                    {/* Filtros por fecha y espacio */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label className="form-label fw-semibold small">Filtrar por fecha</label>
                            <input
                                type="date"
                                className="form-control"
                                value={filtroFecha}
                                onChange={(evento) => setFiltroFecha(evento.target.value)}
                            />
                        </div>
                        <div className="col-md-8">
                            <label className="form-label fw-semibold small">Filtrar por espacio</label>
                            <select
                                className="form-select"
                                value={filtroEspacio}
                                onChange={(evento) => setFiltroEspacio(evento.target.value)}
                            >
                                <option value="">Todos los espacios</option>
                                {espacios.map(function (espacio) {
                                    return <option key={espacio.id} value={espacio.id}>{espacio.nombre}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    {reservasFiltradas.length === 0
                        ? <div className="alert alert-info">No hay reservas que coincidan con los filtros.</div>
                                : <div className="card shadow-sm">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0 tabla-elegante">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Fecha</th>
                                            <th>Hora</th>
                                            <th>Espacio</th>
                                            <th>Residente</th>
                                            <th>Personas</th>
                                            <th>Estado</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reservasFiltradas.map(pintarReserva)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    )
}
