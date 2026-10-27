package com.example.PaseoAPP.modelos;

import com.example.PaseoAPP.enums.Rol;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(nullable = false)
    private String nombres;
    private String apartamento;
    private String torre;
    @Column(unique = true, nullable = false)
    private String correo;
    @Column(nullable = false)
    @JsonAlias({"contrasena", "password"})
    private String contraseña;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;
    private LocalDateTime fechaCreacion;

    public Usuario() {
    }

    public Usuario(UUID id, String nombres, String apartamento, String torre, String correo, String contraseña, Rol rol, LocalDateTime fechaCreacion) {
        this.id = id;
        this.nombres = nombres;
        this.apartamento = apartamento;
        this.torre = torre;
        this.correo = correo;
        this.contraseña = contraseña;
        this.rol = rol;
        this.fechaCreacion = fechaCreacion;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public String getApartamento() {
        return apartamento;
    }

    public void setApartamento(String apartamento) {
        this.apartamento = apartamento;
    }

    public String getTorre() {
        return torre;
    }

    public void setTorre(String torre) {
        this.torre = torre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContraseña() {
        return contraseña;
    }

    public void setContraseña(String contraseña) {
        this.contraseña = contraseña;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
