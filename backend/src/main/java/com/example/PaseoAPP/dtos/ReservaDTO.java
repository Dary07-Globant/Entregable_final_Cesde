package com.example.PaseoAPP.dtos;

import com.example.PaseoAPP.enums.EstadoReserva;

import java.util.UUID;

public record ReservaDTO(
        UUID id,
        UUID usuarioId,
        String usuarioNombre,
        UUID espacioId,
        String espacioNombre,
        String fecha,
        String horaInicio,
        int duracionHoras,
        int numeroPersonas,
        String notaOpcional,
        EstadoReserva estado
) {}
