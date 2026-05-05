package com.example.collab.services;

import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.dtos.WorkspaceMemberDTO;
import com.example.collab.entities.User;
import com.example.collab.entities.Workspace;
import com.example.collab.entities.WorkspaceMember;
import com.example.collab.enums.WorkspaceRole;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.mappers.WorkspaceMappers;
import com.example.collab.repositories.UserRepository;
import com.example.collab.repositories.WorkspaceMemberRepository;
import com.example.collab.repositories.WorkspaceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@Transactional
@AllArgsConstructor
public class WorkspaceMemberServiceImpl implements WorkspaceMemberService{

    private WorkspaceMemberRepository workspaceMemberRepository ;
    private WorkspaceRepository workspaceRepository ;
    private WorkspaceMappers workspaceMappers ;
    private UserRepository userRepository ;
    @Override
    public List<WorkspaceDTO> getAllWorkspaces() {

        return workspaceRepository.findAll().stream().map(workspaceMappers::workspaceToWorkspaceDTO).toList();
    }

    @Override
    public WorkspaceDTO getWorkspaceBySlug(String slug) throws WorkspaceException {
       Workspace workspace = workspaceRepository.findBySlug(slug).orElseThrow(()-> new WorkspaceException("Workspace not found !"));
        return workspaceMappers.workspaceToWorkspaceDTO(workspace);
    }

    @Override
    public WorkspaceDTO getWorkspaceById(Long id) throws WorkspaceException {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new WorkspaceException("Ce workspace n'existe pas !"));
        return workspaceMappers.workspaceToWorkspaceDTO(workspace);
    }

    @Override
    public WorkspaceDTO updateWorkspace(WorkspaceDTO workspaceDTO, Long id) throws WorkspaceException, UserNotFoundException {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new WorkspaceException("Ce workspace n'existe pas !"));
        workspace.setName(workspaceDTO.getName());
        workspace.setDescription(workspaceDTO.getDescription());

        String slug = workspaceDTO.getName().toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        workspace.setSlug(slug);

        return workspaceMappers.workspaceToWorkspaceDTO(workspaceRepository.save(workspace));
    }

    @Override
    public WorkspaceDTO saveWorkspace(WorkspaceDTO workspaceDTO) throws WorkspaceException, UserNotFoundException {
        if (workspaceRepository.findByName(workspaceDTO.getName()).isPresent()) {
            throw new WorkspaceException("Ce workspace existe déjà !");
        }

        Workspace workspace = workspaceMappers.workspaceDTOToWorkspace(workspaceDTO);

        User owner = userRepository.findById(workspaceDTO.getOwnerId())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé !"));
        workspace.setOwner(owner);

        String slug = workspaceDTO.getName().toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        workspace.setSlug(slug);

        Workspace saved = workspaceRepository.save(workspace);

        // Ajouter l'owner comme membre avec le rôle OWNER
        WorkspaceMember ownerMember = new WorkspaceMember();
        ownerMember.setWorkspace(saved);
        ownerMember.setUser(owner);
        ownerMember.setRole(WorkspaceRole.OWNER);
        workspaceMemberRepository.save(ownerMember);

        return workspaceMappers.workspaceToWorkspaceDTO(saved);

    }

    @Override
    public WorkspaceDTO deleteWorkspace(Long id) throws WorkspaceException {
        Workspace workspace = workspaceRepository.findById(id)
                .orElseThrow(() -> new WorkspaceException("Ce workspace n'existe pas !"));
        workspaceRepository.delete(workspace);
        return workspaceMappers.workspaceToWorkspaceDTO(workspace);
    }

    @Override
    public void addMember(Long workspaceId, Long userId) throws UserNotFoundException, WorkspaceException {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceException("Ce workspace n'existe pas !"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Cet utilisateur n'existe pas !"));

        if (workspace.getOwner().getId().equals(userId))
            throw new WorkspaceException("Le propriétaire est déjà membre par défaut !");
        if (workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userId))
            throw new WorkspaceException("L'utilisateur fait déjà partie du workspace !");

        WorkspaceMember member = new WorkspaceMember();
        member.setWorkspace(workspace);
        member.setUser(user);
        member.setRole(WorkspaceRole.MEMBER);
        workspaceMemberRepository.save(member);
    }

    @Override
    public void removeMember(Long workspaceId, Long userId) throws UserNotFoundException, WorkspaceException {
        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new WorkspaceException("Cet utilisateur ne fait pas partie du workspace !"));

        if (member.getRole() == WorkspaceRole.OWNER)
            throw new WorkspaceException("Impossible de retirer le propriétaire du workspace !");

        workspaceMemberRepository.delete(member);
    }

    @Override
    public List<WorkspaceMemberDTO> getWorkspaceMembers(Long workspaceId) throws WorkspaceException {
        workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceException("Workspace introuvable !"));

        return workspaceMemberRepository.findByWorkspaceId(workspaceId).stream()
                .map(m -> new WorkspaceMemberDTO(
                        m.getUser().getId(),
                        m.getUser().getName(),
                        m.getUser().getEmail(),
                        m.getUser().getAvatarUrl(),
                        m.getRole()
                ))
                .toList();
    }

    @Override
    public List<WorkspaceDTO> getWorkspacesByUser(Long userId) throws WorkspaceException {
        return workspaceMemberRepository.findByUserId(userId).stream()
                .map(m -> workspaceMappers.workspaceToWorkspaceDTO(m.getWorkspace()))
                .toList();
    }

    @Override
    public void changeRole(Long workspaceId, Long userId, WorkspaceRole newRole) throws UserNotFoundException, WorkspaceException {
        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new WorkspaceException("Cet utilisateur ne fait pas partie du workspace !"));

        if (member.getRole() == WorkspaceRole.OWNER)
            throw new WorkspaceException("Impossible de changer le rôle du propriétaire !");

        member.setRole(newRole);
        workspaceMemberRepository.save(member);
    }
}
