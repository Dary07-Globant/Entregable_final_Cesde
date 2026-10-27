package com.example.PaseoAPP.modelos;

import com.example.PaseoAPP.enums.CategoriaEspacio;
import jakarta.persistence.*;

import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "espacios")
public class Espacio {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String nombre;
    @Enumerated(EnumType.STRING)
    private CategoriaEspacio categoria;
    @Column(nullable = false)
    private int aforo;
    @Column(length = 1000)
    private String descripcion;
    private String fotoUrl;
    private LocalTime horarioApertura;
    private LocalTime horarioCierre;
    private String ubicacion;
    @Column(nullable = false)
    private boolean activo = true;
    @Column(nullable = false)
    private boolean usoCompartido = false;

    public Espacio() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public CategoriaEspacio getCategoria() {
        return categoria;
    }

    public void setCategoria(CategoriaEspacio categoria) {
        this.categoria = categoria;
    }

    public int getAforo() {
        return aforo;
    }

    public void setAforo(int aforo) {
        this.aforo = aforo;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

    public LocalTime getHorarioApertura() {
        return horarioApertura;
    }

    public void setHorarioApertura(LocalTime horarioApertura) {
        this.horarioApertura = horarioApertura;
    }

    public LocalTime getHorarioCierre() {
        return horarioCierre;
    }

    public void setHorarioCierre(LocalTime horarioCierre) {
        this.horarioCierre = horarioCierre;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public boolean isActivo() {
        return activo;
    }

    public void setActivo(boolean activo) {
        this.activo = activo;
    }

    public boolean isUsoCompartido() {
        return usoCompartido;
    }

    public void setUsoCompartido(boolean usoCompartido) {
        this.usoCompartido = usoCompartido;
    }
}
