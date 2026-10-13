export function TarjetaEspacio({espacio}){
    return(
        <>
            <section className="card p-4 shadow">
                <img src={espacio.foto} alt="" height="400"/>
                <h5 className="card-title fw-bold">{espacio.nombre}</h5>
                <p className="text-muted">{espacio.descripcion}</p>
                <h3>Aforo: {espacio.aforo}</h3>
            </section>

        </>

    )
}