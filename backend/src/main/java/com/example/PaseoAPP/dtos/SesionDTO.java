package com.example.PaseoAPP.dtos;

import com.example.PaseoAPP.enums.Rol;

import java.util.UUID;

public record SesionDTO(
        UUID id,
        String nombres,
        String correo,
        Rol rol,
        String token
) {}
