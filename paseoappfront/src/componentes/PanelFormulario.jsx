import { Link } from 'react-router-dom'

// Layout reutilizable: imagen a la izquierda, formulario a la derecha
export function PanelFormulario({ imagen, titulo, subtitulo, enlaceVolver, children }) {
  return (
    <div className="container-fluid">
      <div className="row panel-formulario">
        <div
          className="col-lg-6 d-none d-lg-flex panel-imagen align-items-end p-5"
          style={{ backgroundImage: `url(${imagen})` }}
        >
          <div>
            <h1 className="display-5 fw-bold">{titulo}</h1>
            <p className="lead mb-0">{subtitulo}</p>
          </div>
        </div>

        <div className="col-lg-6 d-flex align-items-center justify-content-center p-4 p-md-5 bg-white">
          <div className="w-100" style={{ maxWidth: '480px' }}>
            <div className="d-flex align-items-center gap-2 mb-4">
              <i className="bi bi-buildings-fill fs-2 texto-marca"></i>
              <span className="fs-4 fw-bold texto-marca">Paseo App</span>
            </div>

            {enlaceVolver && (
              <Link to={enlaceVolver} className="text-decoration-none text-muted d-inline-block mb-3">
                <i className="bi bi-arrow-left me-1"></i>Volver al inicio
              </Link>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
