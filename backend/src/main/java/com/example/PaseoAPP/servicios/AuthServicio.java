package com.example.PaseoAPP.servicios;

import com.example.PaseoAPP.dtos.PeticionLoginDTO;
import com.example.PaseoAPP.dtos.SesionDTO;
import com.example.PaseoAPP.enums.Rol;
import com.example.PaseoAPP.modelos.Usuario;
import com.example.PaseoAPP.repositorios.IRepositorioUsuario;
import com.example.PaseoAPP.seguridad.UtilJWT;
import com.example.PaseoAPP.validadores.IValidadorUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@Service
public class AuthServicio {

    private final IRepositorioUsuario repositorioUsuario;
    private final IValidadorUsuario validadorUsuario;
    private final UtilJWT utilJWT;
    private final BCryptPasswordEncoder encriptador = new BCryptPasswordEncoder();

    public AuthServicio(IRepositorioUsuario repositorioUsuario,
                        IValidadorUsuario validadorUsuario,
                        UtilJWT utilJWT) {
        this.repositorioUsuario = repositorioUsuario;
        this.validadorUsuario = validadorUsuario;
        this.utilJWT = utilJWT;
    }

    public SesionDTO registrar(Usuario datos) {
        this.validadorUsuario.validarNuevoUsuario(datos);

        // Por defecto todo nuevo registro es USUARIO (residente)
        if (datos.getRol() == null) {
            datos.setRol(Rol.USUARIO);
        }

        Usuario nuevo = new Usuario();
        nuevo.setNombres(datos.getNombres());
        nuevo.setApartamento(datos.getApartamento());
        nuevo.setTorre(datos.getTorre());
        nuevo.setCorreo(datos.getCorreo());
        nuevo.setRol(datos.getRol());
        nuevo.setContraseña(this.encriptador.encode(datos.getContraseña()));
        nuevo.setFechaCreacion(LocalDateTime.now());

        Usuario guardado = this.repositorioUsuario.save(nuevo);
        return this.crearSesion(guardado);
    }

    public SesionDTO iniciarSesion(PeticionLoginDTO peticion) {
        Usuario usuario = this.repositorioUsuario.findByCorreo(peticion.correo())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos"));

        if (!this.encriptador.matches(peticion.contraseña(), usuario.getContraseña())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos");
        }

        return this.crearSesion(usuario);
    }

    private SesionDTO crearSesion(Usuario usuario) {
        String token = this.utilJWT.generarToken(
                usuario.getId(), usuario.getCorreo(), usuario.getRol().name());
        return new SesionDTO(usuario.getId(), usuario.getNombres(), usuario.getCorreo(), usuario.getRol(), token);
    }
}
