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
@RequestMapping({"/portalapi/v1/reservas", "/api/bookings"})
public class ReservaControlador {

    private final IReservaServicio servicio;

    public ReservaControlador(IReservaServicio servicio) {
        this.servicio = servicio;
    }

    // POST /portalapi/v1/reservas o /api/bookings (residentes y administrador)
    @PostMapping
    public ResponseEntity<ReservaDTO> controlarGuardado(@RequestBody Reserva datos) {
        UUID usuarioIdAutenticado = ContextoSesion.obtenerUsuarioId();
        // Si no es admin o si no envió usuario, asociar siempre al usuario autenticado
        if (!ContextoSesion.esAdministrador() || datos.getUsuario() == null || datos.getUsuario().getId() == null) {
            Usuario u = new Usuario();
            u.setId(usuarioIdAutenticado);
            datos.setUsuario(u);
        }

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarReservaEnBD(datos));
    }

    // GET /portalapi/v1/reservas o /api/bookings (solo administrador, validado en filtro)
    @GetMapping
    public ResponseEntity<List<ReservaDTO>> controlarListado() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasEnBD());
    }

    // GET /portalapi/v1/reservas/my-bookings o /api/bookings/my-bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<List<ReservaDTO>> controlarMisReservas() {
        UUID usuarioId = ContextoSesion.obtenerUsuarioId();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasDeUsuarioEnBD(usuarioId));
    }

    // PATCH /portalapi/v1/reservas/{id}/cancel o /api/bookings/{id}/cancel
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ReservaDTO> controlarCancelacion(@PathVariable UUID id) {
        UUID usuarioId = ContextoSesion.obtenerUsuarioId();
        boolean esAdministrador = ContextoSesion.esAdministrador();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.cancelarReservaEnBD(id, usuarioId, esAdministrador));
    }
}
