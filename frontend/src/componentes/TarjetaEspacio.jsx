import { Link } from 'react-router-dom'

import { fotoDeEspacio } from '../services/fotosEspacios.js'

// Tarjeta visual del catalogo: foto, badges de categoria, aforo, horarios
// y boton para "Reservar ahora"
export function TarjetaEspacio({ espacio }) {
    return (
        <div className="tarjeta-zona h-100">
            <div className="tarjeta-zona-foto">
                <img src={fotoDeEspacio(espacio)} alt={espacio.nombre} />
            </div>
            <div className="tarjeta-zona-cuerpo d-flex flex-column flex-grow-1">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold mb-0">{espacio.nombre}</h5>
                    {espacio.categoria && (
                        <span className="badge badge-categoria">{espacio.categoria}</span>
                    )}
                </div>
                <p className="mb-3">{espacio.descripcion}</p>

                <ul className="list-unstyled small mb-3 texto-suave">
                    <li><i className="bi bi-people me-2"></i>Aforo: {espacio.aforo} personas</li>
                    {espacio.horarioApertura && espacio.horarioCierre && (
                        <li><i className="bi bi-clock me-2"></i>{espacio.horarioApertura} – {espacio.horarioCierre}</li>
                    )}
                    {espacio.ubicacion && <li><i className="bi bi-geo-alt me-2"></i>{espacio.ubicacion}</li>}
                    {espacio.usoCompartido && (
                        <li><i className="bi bi-people-fill me-2"></i>Uso compartido</li>
                    )}
                </ul>

                <Link to="/reservas" state={{ espacioId: espacio.id }} className="btn btn-marca mt-auto">
                    <i className="bi bi-calendar-check me-2"></i>Reservar ahora
                </Link>
            </div>
        </div>
    )
}
