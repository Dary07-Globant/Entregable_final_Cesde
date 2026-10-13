package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.modelos.Reserva;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/paseoapi/v1/reservas")
public class ReservaControlador {

    //Por cada serivicio ofrecido
    //configuro 1 funcion controladora

    @Autowired
    ReservaServicio servicio;

    //funcion para controlar el guardado
    @PostMapping
    public ResponseEntity<Reserva>controlarGuardado(@RequestBody Reserva datos){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarReservaEnBD(datos));
    }
    //funcion para controlar las modificaciones
    @PutMapping("/{id}")
    public ResponseEntity<Reserva>controlarModificado(@RequestBody Reserva datos, @PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarReservaEnBD(datos,id));
    }

    //funcion para controlar el borrado
    @DeleteMapping("/{id}")
    public ResponseEntity<?>controlarBorrado(@PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.eliminarReservaEnBD(id));
    }


    //funcion para controlar el listar
    @GetMapping
    public ResponseEntity<?>controlarListado(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarReservasEnBD());
    }

}
