package com.example.collab.services;

import com.example.collab.dtos.UserDTO;
import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.entities.Workspace;
import com.example.collab.mappers.UserMappers;
import com.example.collab.services.WorkspaceService;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.mappers.WorkspaceMappers;
import com.example.collab.repositories.UserRepository;
import com.example.collab.repositories.WorkspaceRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import com.example.collab.entities.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private WorkspaceRepository workspaceRepository;
    private UserRepository userRepository;
    private WorkspaceMappers dtoMapper;
    private UserMappers dtoMapperUser;
    public WorkspaceDTO saveWorkspace(WorkspaceDTO workspaceDTO) throws WorkspaceException, UserNotFoundException {

        if(workspaceRepository.findByName(workspaceDTO.getName()).isPresent()){
            throw new WorkspaceException("Ce workspace existé dàja !");
        }
        Workspace workspace = dtoMapper.workspaceDTOToWorkspace(workspaceDTO);


        User owner = (User) userRepository.findById(workspaceDTO.getOwnerId())
                .orElseThrow(() -> new UserNotFoundException("Utilisateur non trouvé !"));
        workspace.setOwner((User) owner);


        String slug = workspaceDTO.getName().toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        workspace.setSlug(slug);


       Workspace saveSpace =  workspaceRepository.save(workspace);
       return dtoMapper.workspaceToWorkspaceDTO(saveSpace);

    }

    public WorkspaceDTO updateWorkspace(WorkspaceDTO workspaceDTO , Long id) throws WorkspaceException, UserNotFoundException {

        Workspace workspace = workspaceRepository.findById(id).orElseThrow( () -> new WorkspaceException("Ce workspace n'existe pas !"));
        workspace.setName(workspaceDTO.getName());
        workspace.setDescription(workspaceDTO.getDescription());
        workspace = workspaceRepository.save(workspace);

        //je ne fais aucun traitement pour le owner vu qu'il ne change pas

        String slug = workspaceDTO.getName().toLowerCase()
                .replaceAll("[^a-z0-9]", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
        workspace.setSlug(slug);

        Workspace updateSpace =  workspaceRepository.save(workspace);
        return dtoMapper.workspaceToWorkspaceDTO(updateSpace);
    }

    public WorkspaceDTO getWorkspaceBySlug(String slug) throws WorkspaceException {

        Workspace workspace = workspaceRepository.findBySlug(slug).orElseThrow(()-> new WorkspaceException("Ce workspace n'existe pas !"));

        return dtoMapper.workspaceToWorkspaceDTO(workspace);
    }

    public WorkspaceDTO getWorkspaceById(Long id) throws WorkspaceException {

        Workspace workspace = workspaceRepository.findById(id).orElseThrow(()-> new WorkspaceException("Ce workspace n'existe pas !"));

        return dtoMapper.workspaceToWorkspaceDTO(workspace);
    }

    public List<WorkspaceDTO> getAllWorkspaces() {

        List<Workspace> workspaces = workspaceRepository.findAll();
        return workspaces.stream().map(workspace ->
            dtoMapper.workspaceToWorkspaceDTO(workspace)
        ).toList();
    }

    public WorkspaceDTO deleteWorkspace(Long id) throws WorkspaceException {
        Workspace workspace = workspaceRepository.findById(id).orElseThrow(()->  new WorkspaceException("Ce workspace n'existe pas !"));

        workspaceRepository.delete(workspace);
        return dtoMapper.workspaceToWorkspaceDTO(workspace);
    }

    public void addMember(Long workspaceId , Long userId) throws UserNotFoundException, WorkspaceException {

        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceException("Cet espce de travail n'existe pas !"));
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Cet utilisateur n'existe pas !"));

        //Impossible de s'ajouter soi même
        if (workspace.getOwner().getId().equals(user.getId())) {
            throw new WorkspaceException("Le propriétaire est déjà membre par défaut !");
        }
        //Si le user fait deja parti du workspace
        if(workspace.getCollaborators().contains(user)){
            throw new WorkspaceException("L'utilisateur fait deja parti du workspace");
        }

        workspace.getCollaborators().add(user);

        workspaceRepository.save(workspace);
    }

    public void removeMember (Long workspaceId , Long userId) throws UserNotFoundException, WorkspaceException {

        Workspace workspace = workspaceRepository.findById(workspaceId).orElseThrow(() -> new WorkspaceException("Cet espce de travail n'existe pas !"));
        User user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("Cet utilisateur n'existe pas !"));

        //vérifier si le user fait parti du workspace
        if(!workspace.getCollaborators().contains(user)){
            throw new WorkspaceException("L'utilisateur ne fait pas partie de ce workspace");
        }

        //Impossible de se supprimer soi même

        if(workspace.getOwner().getId().equals(user.getId())){
            throw new WorkspaceException("Vous ne pouvez pas vous retirer de l'espace de travail");
        }

        workspace.getCollaborators().remove(user);
        workspaceRepository.save(workspace);
    }
    public List<UserDTO> getWorkspaceMembers(Long workspaceId) throws WorkspaceException {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new WorkspaceException("Workspace introuvable"));


        return workspace.getCollaborators().stream()
                .map(user -> dtoMapperUser.userToUserDTO(user))
                .toList();
    }
}
