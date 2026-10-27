package com.example.PaseoAPP.dtos;

import com.example.PaseoAPP.enums.CategoriaEspacio;

import java.util.UUID;

public record EspacioDTO(
        UUID id,
        String nombre,
        CategoriaEspacio categoria,
        int aforo,
        String descripcion,
        String fotoUrl,
        String horarioApertura,
        String horarioCierre,
        String ubicacion,
        boolean activo,
        boolean usoCompartido
) {}
