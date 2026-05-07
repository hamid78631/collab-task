
package com.example.collab.web;

import com.example.collab.dtos.AuthResponse;
import com.example.collab.dtos.RegisterRequest;
import com.example.collab.entities.User;
import com.example.collab.entities.Workspace;
import com.example.collab.entities.WorkspaceMember;
import com.example.collab.enums.WorkspaceRole;
import com.example.collab.repositories.UserRepository;
import com.example.collab.repositories.WorkspaceMemberRepository;
import com.example.collab.repositories.WorkspaceRepository;
import com.example.collab.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {

        // Vérifier que l'email n'est pas déjà utilisé
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().build();
        }

        // Créer l'utilisateur avec le mot de passe hashé (jamais en clair !)
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // Créer un workspace par défaut pour le nouvel utilisateur
        Workspace workspace = new Workspace();
        workspace.setName(user.getName() + "'s Workspace");
        workspace.setDescription("Workspace par défaut");
        String slug = user.getName().toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "")
                + "-" + user.getId();
        workspace.setSlug(slug);
        workspace.setOwner(user);
        Workspace savedWorkspace = workspaceRepository.save(workspace);

        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setWorkspace(savedWorkspace);
        ownerMember.setUser(user);
        ownerMember.setRole(WorkspaceRole.OWNER);
        workspaceMemberRepository.save(ownerMember);

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail());

        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), savedWorkspace.getId()));
    }

    // POST /auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody RegisterRequest request) {

        // Cas 1 : utilisateur introuvable
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("Aucun compte trouvé avec cet email");
        }

        // Cas 2 : mot de passe incorrect
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Mot de passe incorrect");
        }

        // Générer le token JWT
        String token = jwtUtil.generateToken(user.getEmail());

        // Récupérer le premier workspace de l'utilisateur
        Long workspaceId = workspaceRepository.findByOwnerId(user.getId())
                .stream().findFirst().map(Workspace::getId).orElse(null);

        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), workspaceId));
    }
}

