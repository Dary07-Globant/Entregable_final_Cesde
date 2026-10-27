package com.example.PaseoAPP.seguridad;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class UtilJWT {

    // En produccion esta clave debe venir de una variable de entorno
    private static final String CLAVE_SECRETA = "paseo-app-clave-secreta-para-firmar-tokens-jwt-2026";

    private static final long DURACION_TOKEN_MILIS = 1000L * 60 * 60 * 8; // 8 horas

    private final SecretKey clave = Keys.hmacShaKeyFor(CLAVE_SECRETA.getBytes());

    public String generarToken(UUID usuarioId, String correo, String rol) {
        return Jwts.builder()
                .subject(usuarioId.toString())
                .claim("correo", correo)
                .claim("rol", rol)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + DURACION_TOKEN_MILIS))
                .signWith(clave)
                .compact();
    }

    public Claims leerToken(String token) {
        return Jwts.parser()
                .verifyWith(clave)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean esValido(String token) {
        try {
            this.leerToken(token);
            return true;
        } catch (JwtException | IllegalArgumentException error) {
            return false;
        }
    }

    public UUID obtenerUsuarioId(String token) {
        return UUID.fromString(this.leerToken(token).getSubject());
    }

    public String obtenerRol(String token) {
        return this.leerToken(token).get("rol", String.class);
    }
}
