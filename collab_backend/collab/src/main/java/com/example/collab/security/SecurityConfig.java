package com.example.collab.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Désactiver CSRF (inutile pour une API REST avec JWT)
                .csrf(csrf -> csrf.disable())

                // Définir quelles routes sont publiques et lesquelles sont protégées
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()       // login et register : libres
                        .requestMatchers("/swagger-ui/**").permitAll() // swagger : libre
                        .requestMatchers("/v3/api-docs/**").permitAll()// swagger docs : libre
                        .anyRequest().authenticated()                  // tout le reste : token obligatoire
                )

                // Ne pas utiliser les sessions HTTP (on est stateless avec JWT)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Brancher notre JwtFilter AVANT le filtre d'auth par défaut de Spring
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Le bean PasswordEncoder utilisé dans AuthController pour hasher les mots de passe
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
