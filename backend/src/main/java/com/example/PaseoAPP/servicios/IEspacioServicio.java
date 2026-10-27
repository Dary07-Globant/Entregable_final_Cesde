package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.modelos.Espacio;

import java.util.List;
import java.util.UUID;

public interface IEspacioServicio {

    EspacioDTO guardarEspacioEnBD(Espacio datos);

    EspacioDTO modificarEspacioEnBD(Espacio datos, UUID id);

    List<EspacioDTO> buscarEspaciosActivosEnBD();

    List<EspacioDTO> buscarEspaciosEnBD();

    EspacioDTO buscarEspacioPorId(UUID id);
}
