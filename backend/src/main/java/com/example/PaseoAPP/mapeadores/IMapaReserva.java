package com.example.PaseoAPP.mapeadores;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.modelos.Reserva;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IMapaReserva {

    default ReservaDTO convertir_modelo_a_dto(Reserva reserva) {
        if (reserva == null) {
            return null;
        }
        return new ReservaDTO(
                reserva.getId(),
                reserva.getUsuario() != null ? reserva.getUsuario().getId() : null,
                reserva.getUsuario() != null ? reserva.getUsuario().getNombres() : null,
                reserva.getEspacio() != null ? reserva.getEspacio().getId() : null,
                reserva.getEspacio() != null ? reserva.getEspacio().getNombre() : null,
                reserva.getFecha(),
                reserva.getHoraInicio(),
                reserva.getDuracionHoras(),
                reserva.getNumeroPersonas(),
                reserva.getNotaOpcional(),
                reserva.getEstado()
        );
    }

    default List<ReservaDTO> convertir_lista_de_modelo_a_lista_de_dto(List<Reserva> lista) {
        if (lista == null) {
            return List.of();
        }
        return lista.stream()
                .map(this::convertir_modelo_a_dto)
                .toList();
    }
}
