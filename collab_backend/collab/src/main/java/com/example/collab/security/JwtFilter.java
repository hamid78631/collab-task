
package com.example.collab.security;

import com.example.collab.repositories.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Laisser passer les requêtes OPTIONS (CORS preflight) sans authentification
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Lire le header "Authorization" de la requête
        String authHeader = request.getHeader("Authorization");

        //  Si pas de header ou ne commence pas par "Bearer " → on laisse passer
        //    (Spring Security décidera ensuite si la route est protégée ou non)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Extraire le token (enlever "Bearer " du début)
        String token = authHeader.substring(7);

        //  Vérifier que le token est valide
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Extraire l'email depuis le token
        String email = jwtUtil.extractEmail(token);

        //  Vérifier que l'utilisateur existe en base (sans charger les collections lazy)
        boolean userExists = userRepository.existsByEmail(email);

        if (!userExists) {
            filterChain.doFilter(request, response);
            return;
        }

        // Créer un objet "authentication" avec l'email comme principal
        // (on évite de stocker l'entité User pour ne pas déclencher de lazy loading)
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(email, null, List.of());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        //  Continuer vers le controller
        filterChain.doFilter(request, response);
    }
}

