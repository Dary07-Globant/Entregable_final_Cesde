package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.ReservaDTO;
import com.example.PaseoAPP.modelos.Reserva;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.seguridad.ContextoSesion;
import com.example.PaseoAPP.servicios.IReservaServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/portalapi/v1/reservas")
public class ReservaControlador {

    private final IReservaServicio servicio;

    public ReservaControlador(IReservaServicio servicio) {
        this.servicio = servicio;
    }

    // POST /portalapi/v1/reservas  (residentes y administrador)
    @PostMapping
    public ResponseEntity<ReservaDTO> controlarGuardado(@RequestBody Reserva datos) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarReservaEnBD(datos));
    }

    // GET /portalapi/v1/reservas  (solo administrador, validado en el filtro)
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> controlarListado() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasEnBD());
    }

    // GET /portalapi/v1/reservas/my-bookings  (reservas del usuario autenticado)
    @GetMapping("/my-bookings")
    public ResponseEntity<List<ReservaDTO>> controlarMisReservas() {
        UUID usuarioId = ContextoSesion.obtenerUsuarioId();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasDeUsuarioEnBD(usuarioId));
    }

    // PATCH /portalapi/v1/reservas/{id}/cancel  (dueño de la reserva o administrador)
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservaDTO> controlarCancelacion(@PathVariable UUID id) {
        UUID usuarioId = ContextoSesion.obtenerUsuarioId();
        boolean esAdministrador = ContextoSesion.esAdministrador();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.cancelarReservaEnBD(id, usuarioId, esAdministrador));
    }
}
