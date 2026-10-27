package com.example.PaseoAPP.seguridad;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

/**
 * Interpreta el header Authorization: Bearer <token> en cada peticion.
 * Las rutas de /auth son publicas; el resto exige un token valido.
 * Las rutas de administracion exigen rol ADMINISTRADOR.
 */
@Component
public class FiltroAutenticacion extends OncePerRequestFilter {

    private static final List<String> RUTAS_PUBLICAS = List.of(
            "/paseoapi/v1/auth/login",
            "/paseoapi/v1/auth/register"
    );

    private final UtilJWT utilJWT;

    public FiltroAutenticacion(UtilJWT utilJWT) {
        this.utilJWT = utilJWT;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest peticion,
                                    HttpServletResponse respuesta,
                                    FilterChain cadena) throws ServletException, IOException {

        String ruta = peticion.getRequestURI();
        String metodo = peticion.getMethod();

        // Registro y login son publicos
        if (ruta.endsWith("/auth/login") || ruta.endsWith("/auth/register")) {
            cadena.doFilter(peticion, respuesta);
            return;
        }

        String encabezado = peticion.getHeader("Authorization");
        if (encabezado == null || !encabezado.startsWith("Bearer ")) {
            respuesta.sendError(HttpStatus.UNAUTHORIZED.value(), "Debes iniciar sesion para continuar");
            return;
        }

        String token = encabezado.substring(7).trim();
        if (!this.utilJWT.esValido(token)) {
            respuesta.sendError(HttpStatus.UNAUTHORIZED.value(), "Sesion invalida o expirada, inicia sesion de nuevo");
            return;
        }

        Claims datos = this.utilJWT.leerToken(token);
        ContextoSesion.establecer(UUID.fromString(datos.getSubject()), datos.get("rol", String.class));

        try {
            // Solo el administrador puede administrar usuarios y crear/modificar espacios
            boolean esRutaDeUsuarios = ruta.contains("/usuarios");
            boolean esEscrituraDeEspacios = ruta.contains("/espacios")
                    && !"GET".equalsIgnoreCase(metodo);
            boolean esListadoDeReservas = ruta.contains("/reservas")
                    && "GET".equalsIgnoreCase(metodo)
                    && !ruta.endsWith("/my-bookings");

            if ((esRutaDeUsuarios || esEscrituraDeEspacios || esListadoDeReservas)
                    && !"ADMINISTRADOR".equals(datos.get("rol", String.class))) {
                respuesta.sendError(HttpStatus.FORBIDDEN.value(), "Esta accion requiere rol de administrador");
                return;
            }

            cadena.doFilter(peticion, respuesta);
        } finally {
            ContextoSesion.limpiar();
        }
    }
}
