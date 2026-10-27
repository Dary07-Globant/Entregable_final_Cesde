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
import java.util.UUID;

/**
 * Interpreta el header Authorization: Bearer <token> en cada peticion.
 * Preflights CORS (OPTIONS) y rutas de /auth son publicas.
 * Las rutas de administracion exigen rol ADMINISTRADOR.
 */
@Component
public class FiltroAutenticacion extends OncePerRequestFilter {

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

        // Responder OK a preflights de CORS (OPTIONS) enviados por navegadores
        if ("OPTIONS".equalsIgnoreCase(metodo)) {
            respuesta.setStatus(HttpServletResponse.SC_OK);
            cadena.doFilter(peticion, respuesta);
            return;
        }

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
            // Solo el administrador puede administrar usuarios, crear/modificar espacios y ver listado global de reservas
            boolean esRutaDeUsuarios = ruta.contains("/usuarios") || ruta.contains("/users");
            boolean esEscrituraDeEspacios = (ruta.contains("/espacios") || ruta.contains("/spaces"))
                    && !"GET".equalsIgnoreCase(metodo);
            boolean esListadoGlobalDeReservas = (ruta.contains("/reservas") || ruta.contains("/bookings"))
                    && "GET".equalsIgnoreCase(metodo)
                    && !ruta.endsWith("/my-bookings");

            if ((esRutaDeUsuarios || esEscrituraDeEspacios || esListadoGlobalDeReservas)
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
