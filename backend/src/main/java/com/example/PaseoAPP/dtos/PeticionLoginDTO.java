package com.example.PaseoAPP.dtos;

import com.fasterxml.jackson.annotation.JsonAlias;

public record PeticionLoginDTO(
        String correo,
        @JsonAlias({"contrasena", "password"})
        String contraseña
) {}
