package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.modelos.Reserva;

import java.util.List;
import java.util.UUID;

public interface IReservaServicio {

    ReservaDTO guardarReservaEnBD(Reserva datos);

    List<ReservaDTO> buscarReservasEnBD();

    List<ReservaDTO> buscarReservasDeUsuarioEnBD(UUID usuarioId);

    ReservaDTO cancelarReservaEnBD(UUID id, UUID usuarioId, boolean esAdministrador);
}
