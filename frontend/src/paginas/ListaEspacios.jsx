import { useEffect, useMemo, useState } from 'react'
import { listarEspacios } from '../services/servicioEspacios.js'
import { TarjetaEspacio } from '../componentes/TarjetaEspacio.jsx'
import { Spinner } from '../componentes/Spinner.jsx'
import { Navbar } from '../componentes/Navbar.jsx'

export function ListaEspacios() {
  const [espacios, setEspacios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('TODAS')

  useEffect(function () {
    async function cargarEspacios() {
      try {
        const datos = await listarEspacios()
        setEspacios(datos)
      } catch (err) {
        setError(err.response?.data?.message || 'No fue posible cargar el catálogo de espacios')
      } finally {
        setCargando(false)
      }
    }
    cargarEspacios()
  }, [])

  // Categorias unicas presentes en los datos
  const categorias = useMemo(() => {
    const setCat = new Set()
    espacios.forEach((e) => {
      if (e.categoria) setCat.add(e.categoria)
    })
    return ['TODAS', ...Array.from(setCat)]
  }, [espacios])

  // Filtrado por texto y categoria
  const espaciosFiltrados = useMemo(() => {
    return espacios.filter((e) => {
      const coincideTexto =
        e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
        e.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())

      const coincideCategoria =
        categoriaSeleccionada === 'TODAS' || e.categoria === categoriaSeleccionada

      return coincideTexto && coincideCategoria
    })
  }, [espacios, busqueda, categoriaSeleccionada])

  return (
    <div className="container pagina-interna">
      <Navbar />

      <div className="encabezado-pagina mb-4">
        <span className="etiqueta-seccion">Catálogo</span>
        <h1 className="fw-bold mt-2 mb-1">Zonas comunes de la unidad</h1>
        <p className="texto-suave mb-0">
          Explora los espacios disponibles, consulta aforos y reserva en segundos.
        </p>
      </div>

      {error && <div className="alerta-relajante error mb-4"><i className="bi bi-exclamation-triangle me-2"></i>{error}</div>}

      {/* Barra de Filtros y Búsqueda */}
      <div className="card-neutra p-3 mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Buscar por nombre, descripción o ubicación..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex align-items-center gap-2 flex-wrap justify-content-md-end">
              <span className="small text-muted me-1">Categoría:</span>
              {categorias.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaSeleccionada(cat)}
                  className={`btn btn-sm ${
                    categoriaSeleccionada === cat ? 'btn-marca' : 'btn-fantasma'
                  }`}
                  style={{ fontSize: '0.82rem', padding: '0.35rem 0.75rem' }}
                >
                  {cat === 'TODAS' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {cargando && (
        <div className="py-5 text-center">
          <Spinner texto="Cargando catálogo de espacios..." />
        </div>
      )}

      {!cargando && !error && (
        espaciosFiltrados.length === 0 ? (
          <div className="card-neutra p-5 text-center my-4">
            <i className="bi bi-search fs-2 text-muted mb-2 d-block"></i>
            <h5 className="fw-semibold">No se encontraron espacios</h5>
            <p className="texto-suave mb-0">Intenta con otro término de búsqueda o cambia la categoría seleccionada.</p>
          </div>
        ) : (
          <div className="row g-4 mb-5">
            {espaciosFiltrados.map((espacio) => (
              <div className="col-lg-4 col-md-6" key={espacio.id}>
                <TarjetaEspacio espacio={espacio} />
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}
