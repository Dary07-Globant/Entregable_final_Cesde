import { Link } from 'react-router-dom'
import { fotoDeEspacio } from '../services/fotosEspacios.js'
import fachada from '../assets/fachada_unidad.jpg'

// Tarjeta visual del catalogo: foto, categoria, aforo, horarios y boton directo para reservar
export function TarjetaEspacio({ espacio }) {
  const foto = fotoDeEspacio(espacio)

  return (
    <div className="tarjeta-zona h-100">
      <div className="tarjeta-zona-foto">
        <img
          src={foto}
          alt={espacio.nombre}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = fachada
          }}
        />
      </div>

      <div className="tarjeta-zona-cuerpo">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <h5 className="fw-semibold mb-0">{espacio.nombre}</h5>
          {espacio.categoria && (
            <span className="badge-categoria">{espacio.categoria}</span>
          )}
        </div>

        <p className="mb-3">{espacio.descripcion}</p>

        <ul className="list-unstyled small mb-4 texto-suave">
          <li className="d-flex align-items-center gap-2 mb-1">
            <i className="bi bi-people text-muted"></i>
            <span>Aforo: <strong>{espacio.aforo}</strong> personas</span>
          </li>
          {espacio.horarioApertura && espacio.horarioCierre && (
            <li className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-clock text-muted"></i>
              <span>{espacio.horarioApertura} – {espacio.horarioCierre}</span>
            </li>
          )}
          {espacio.ubicacion && (
            <li className="d-flex align-items-center gap-2 mb-1">
              <i className="bi bi-geo-alt text-muted"></i>
              <span>{espacio.ubicacion}</span>
            </li>
          )}
          {espacio.usoCompartido ? (
            <li className="d-flex align-items-center gap-2 text-success small">
              <i className="bi bi-people-fill"></i>
              <span>Uso compartido disponible</span>
            </li>
          ) : (
            <li className="d-flex align-items-center gap-2 text-muted small">
              <i className="bi bi-lock-fill"></i>
              <span>Uso exclusivo por reserva</span>
            </li>
          )}
        </ul>

        <Link
          to="/reservas"
          state={{ espacioId: espacio.id }}
          className="btn btn-marca mt-auto w-100"
        >
          <i className="bi bi-calendar-check"></i>
          Reservar ahora
        </Link>
      </div>
    </div>
  )
}
