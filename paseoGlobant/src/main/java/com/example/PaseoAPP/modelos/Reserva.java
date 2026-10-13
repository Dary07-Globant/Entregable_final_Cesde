package com.example.PaseoAPP.modelos;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "reservas")
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String fecha;
    private String tiempo;
    public Reserva() {
    }
    public Reserva(UUID id, String fecha, String tiempo) {
        this.id = id;
        this.fecha = fecha;
        this.tiempo = tiempo;
    }
    public UUID getId() {
        return id;
    }
    public void setId(UUID id) {
        this.id = id;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    public String getTiempo() {
        return tiempo;
    }
    public void setTiempo(String tiempo) {
        this.tiempo = tiempo;
    }


}
