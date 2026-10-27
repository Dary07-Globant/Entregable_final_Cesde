package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.mapeadores.IMapaEspacio;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.repositorios.IRepositorioEspacio;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EspacioServicioImpl implements IEspacioServicio {

    private final IMapaEspacio mapaEspacio;
    private final IRepositorioEspacio repositorioEspacio;

    public EspacioServicioImpl(IMapaEspacio mapaEspacio, IRepositorioEspacio repositorioEspacio) {
        this.mapaEspacio = mapaEspacio;
        this.repositorioEspacio = repositorioEspacio;
    }

    @Override
    public EspacioDTO guardarEspacioEnBD(Espacio datos) {
        validarNombreObligatorio(datos.getNombre());
        validarAforo(datos.getAforo());
        validarHorarios(datos);

        // El nombre del espacio debe ser unico entre los activos
        if (this.repositorioEspacio.findByNombre(datos.getNombre()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un espacio con ese nombre");
        }

        datos.setActivo(true);
        Espacio espacioGuardado = this.repositorioEspacio.save(datos);
        return this.mapaEspacio.convertir_modelo_a_dto(espacioGuardado);
    }

    @Override
    public EspacioDTO modificarEspacioEnBD(Espacio datos, UUID id) {
        Espacio espacioEncontrado = this.repositorioEspacio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Espacio no encontrado"));

        validarAforo(datos.getAforo());
        validarHorarios(datos);

        espacioEncontrado.setNombre(datos.getNombre());
        espacioEncontrado.setCategoria(datos.getCategoria());
        espacioEncontrado.setAforo(datos.getAforo());
        espacioEncontrado.setDescripcion(datos.getDescripcion());
        espacioEncontrado.setFotoUrl(datos.getFotoUrl());
        espacioEncontrado.setHorarioApertura(datos.getHorarioApertura());
        espacioEncontrado.setHorarioCierre(datos.getHorarioCierre());
        espacioEncontrado.setUbicacion(datos.getUbicacion());
        espacioEncontrado.setActivo(datos.isActivo());
        espacioEncontrado.setUsoCompartido(datos.isUsoCompartido());

        Espacio espacioModificado = this.repositorioEspacio.save(espacioEncontrado);
        return this.mapaEspacio.convertir_modelo_a_dto(espacioModificado);
    }

    @Override
    public List<EspacioDTO> buscarEspaciosActivosEnBD() {
        return this.mapaEspacio.convertir_lista_de_modelo_a_lista_de_dto(
                this.repositorioEspacio.findByActivoTrue());
    }

    @Override
    public List<EspacioDTO> buscarEspaciosEnBD() {
        return this.mapaEspacio.convertir_lista_de_modelo_a_lista_de_dto(
                this.repositorioEspacio.findAll());
    }

    @Override
    public EspacioDTO buscarEspacioPorId(UUID id) {
        Espacio espacio = this.repositorioEspacio.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Espacio no encontrado"));
        return this.mapaEspacio.convertir_modelo_a_dto(espacio);
    }

    // Reglas de validacion individuales
    private void validarNombreObligatorio(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del espacio es obligatorio");
        }
    }

    private void validarAforo(int aforo) {
        if (aforo <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El aforo debe ser mayor a 0");
        }
    }

    private void validarHorarios(Espacio espacio) {
        if (espacio.getHorarioApertura() == null || espacio.getHorarioCierre() == null) {
            return; // Se permite espacio sin horario definido
        }
        if (!espacio.getHorarioCierre().isAfter(espacio.getHorarioApertura())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El horario de cierre debe ser posterior al de apertura");
        }
    }
}
