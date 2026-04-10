package com.example.collab.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Clé secrète utilisée pour signer les tokens
    // Elle doit faire au moins 256 bits (32 caractères) pour HS256

    private final Key secretKey = Keys.hmacShaKeyFor(
            "collab-task-super-secret-key-2026-ok".getBytes()
    );

    // Durée de validité du token : 24 heures en millisecondes
    private final long EXPIRATION = 1000 * 60 * 60 * 24;

    // Génère un token JWT à partir de l'email de l'utilisateur
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)           // email
                .setIssuedAt(new Date())     // date de création
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION)) // date d'expiration
                .signWith(secretKey, SignatureAlgorithm.HS256) // signature avec notre clé
                .compact(); // construit la chaîne finale
    }

    // Extrait l'email depuis un token
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // Vérifie si le token est encore valide (non expiré)
    public boolean isTokenValid(String token) {
        try {
            return getClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false; // token malformé ou signature invalide
        }
    }

    // Méthode privée : parse le token et retourne son contenu (claims)
    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
