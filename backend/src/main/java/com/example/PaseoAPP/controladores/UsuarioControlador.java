package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.UsuarioDTO;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.servicios.IUsuarioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/portalapi/v1/usuarios", "/api/users"})
public class UsuarioControlador {

    private final IUsuarioServicio servicio;

    public UsuarioControlador(IUsuarioServicio servicio) {
        this.servicio = servicio;
    }

    // POST /portalapi/v1/usuarios o /api/users
    @PostMapping
    public ResponseEntity<UsuarioDTO> controlarGuardado(@RequestBody Usuario datos) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarUsuarioEnBD(datos));
    }

    // PUT /portalapi/v1/usuarios/{id} o /api/users/{id}
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> controlarModificado(@RequestBody Usuario datos, @PathVariable UUID id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarUsuarioEnBD(datos, id));
    }

    // DELETE /portalapi/v1/usuarios/{id} o /api/users/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> controlarBorrado(@PathVariable UUID id) {
        this.servicio.eliminarUsuarioEnBD(id);
        return ResponseEntity.noContent().build();
    }

    // GET /portalapi/v1/usuarios o /api/users
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> controlarListado() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarUsuariosEnBD());
    }
}
