package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.PeticionLoginDTO;
import com.example.PaseoAPP.dtos.SesionDTO;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.servicios.AuthServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/portalapi/v1/auth", "/api/auth"})
public class AuthControlador {

    private final AuthServicio servicio;

    public AuthControlador(AuthServicio servicio) {
        this.servicio = servicio;
    }

    // POST /portalapi/v1/auth/register o /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<SesionDTO> controlarRegistro(@RequestBody Usuario datos) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.registrar(datos));
    }

    // POST /portalapi/v1/auth/login o /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<SesionDTO> controlarLogin(@RequestBody PeticionLoginDTO peticion) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.iniciarSesion(peticion));
    }
}
