package com.example.PaseoAPP.seguridad;

import java.util.UUID;

/**
 * Guarda en memoria (por hilo) quien esta autenticado en la peticion actual.
 * El filtro llena este contexto y los controladores lo consultan.
 */
public class ContextoSesion {

    private static final ThreadLocal<UUID> usuarioIdActual = new ThreadLocal<>();
    private static final ThreadLocal<String> rolActual = new ThreadLocal<>();

    public static void establecer(UUID usuarioId, String rol) {
        usuarioIdActual.set(usuarioId);
        rolActual.set(rol);
    }

    public static UUID obtenerUsuarioId() {
        return usuarioIdActual.get();
    }

    public static String obtenerRol() {
        return rolActual.get();
    }

    public static boolean esAdministrador() {
        return "ADMINISTRADOR".equals(rolActual.get());
    }

    public static void limpiar() {
        usuarioIdActual.remove();
        rolActual.remove();
    }
}
