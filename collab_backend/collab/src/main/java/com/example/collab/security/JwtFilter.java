
package com.example.collab.security;

import com.example.collab.entities.User;
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

        // 1. Lire le header "Authorization" de la requête
        String authHeader = request.getHeader("Authorization");

        // 2. Si pas de header ou ne commence pas par "Bearer " → on laisse passer
        //    (Spring Security décidera ensuite si la route est protégée ou non)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Extraire le token (enlever "Bearer " du début)
        String token = authHeader.substring(7);

        // 4. Vérifier que le token est valide
        if (!jwtUtil.isTokenValid(token)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Extraire l'email depuis le token
        String email = jwtUtil.extractEmail(token);

        // 6. Charger l'utilisateur depuis la base
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 7. Créer un objet "authentication" et le mettre dans le contexte Spring Security
        //    → Spring sait maintenant que cette requête est authentifiée
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(user, null, List.of());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 8. Continuer vers le controller
        filterChain.doFilter(request, response);
    }
}

