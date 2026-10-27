package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.dtos.EspacioDTO;
import com.example.PaseoAPP.modelos.Espacio;
import com.example.PaseoAPP.servicios.IEspacioServicio;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/portalapi/v1/espacios")
public class EspacioControlador {

    private final IEspacioServicio servicio;

    public EspacioControlador(IEspacioServicio servicio) {
        this.servicio = servicio;
    }

    // GET /portalapi/v1/espacios  (publico para usuarios autenticados: solo activos)
    @GetMapping
    public ResponseEntity<List<EspacioDTO>> controlarListado() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarEspaciosActivosEnBD());
    }

    // POST /portalapi/v1/espacios  (solo administrador, validado en el filtro)
    @PostMapping
    public ResponseEntity<EspacioDTO> controlarGuardado(@RequestBody Espacio datos) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarEspacioEnBD(datos));
    }

    // PUT /portalapi/v1/espacios/{id}  (solo administrador)
    @PutMapping("/{id}")
    public ResponseEntity<EspacioDTO> controlarModificado(@RequestBody Espacio datos, @PathVariable UUID id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarEspacioEnBD(datos, id));
    }

    // GET /portalapi/v1/espacios/{id}
    @GetMapping("/{id}")
    public ResponseEntity<EspacioDTO> controlarBusquedaPorId(@PathVariable UUID id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarEspacioPorId(id));
    }
}
