package com.example.PaseoAPP.controladores;

import com.example.PaseoAPP.modelos.Espacio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/paseoapi/v1/espacios")
public class EspacioControlador {

    //Por cada serivicio ofrecido
    //configuro 1 funcion controladora

    @Autowired
    EspacioServicio servicio;

    //funcion para controlar el guardado
    @PostMapping
    public ResponseEntity<Espacio>controlarGuardado(@RequestBody Espacio datos){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(this.servicio.guardarEspacioEnBD(datos));
    }
    //funcion para controlar las modificaciones
    @PutMapping("/{id}")
    public ResponseEntity<Espacio>controlarModificado(@RequestBody Espacio datos, @PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.modificarEspacioEnBD(datos,id));
    }

    //funcion para controlar el borrado
    @DeleteMapping("/{id}")
    public ResponseEntity<?>controlarBorrado(@PathVariable UUID id){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.eliminarEspacioEnBD(id));
    }


    //funcion para controlar el listar
    @GetMapping
    public ResponseEntity<?>controlarListado(){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(this.servicio.buscarEspaciosEnBD());
    }

}
