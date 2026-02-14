package com.example.collab.web;

import com.example.collab.dtos.UserDTO;
import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.services.WorkspaceService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Transactional
@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class WorksController {

    private WorkspaceService workspaceService;

    @GetMapping("/workspaces")
    public List<WorkspaceDTO> getWorkspaces(){

        return workspaceService.getAllWorkspaces();
    }
    @GetMapping("/workspaces/{id}")
    public WorkspaceDTO getWorkspaceById(@PathVariable Long id) throws WorkspaceException {
        return workspaceService.getWorkspaceById(id);
    }

    @GetMapping("/workspaces/slug/{slug}")
    public WorkspaceDTO getWorkspace(@PathVariable String slug) throws WorkspaceException {
        return workspaceService.getWorkspaceBySlug(slug );
    }

    @PostMapping("/workspaces")
    public WorkspaceDTO createWorkspace(@RequestBody WorkspaceDTO workspaceDTO) throws WorkspaceException, UserNotFoundException {

        return workspaceService.saveWorkspace( workspaceDTO);
    }

    @PutMapping("/workspaces/{id}")
    public WorkspaceDTO updateWorkspace(@RequestBody WorkspaceDTO workspaceDTO , @PathVariable Long id) throws WorkspaceException, UserNotFoundException {

        return workspaceService.updateWorkspace(workspaceDTO , id);
    }

    @DeleteMapping("/workspaces/{id}")
    public WorkspaceDTO deleteWorkspace(@PathVariable Long id) throws WorkspaceException, UserNotFoundException {
        return workspaceService.deleteWorkspace(id);
    }

    @PostMapping("/workspaces/{workspaceId}/collaborators/{userId}")
    public void addMember(@PathVariable Long workspaceId ,@PathVariable Long userId) throws UserNotFoundException, WorkspaceException {
        workspaceService.addMember(workspaceId , userId);
    }
    @DeleteMapping("/workspaces/{workspaceId}/collaborators/{userId}")
    public void removeMember( @PathVariable Long workspaceId , @PathVariable Long userId) throws UserNotFoundException, WorkspaceException {
        workspaceService.removeMember(workspaceId , userId);
    }

    @GetMapping("/workspaces/{id}/members")
    public List<UserDTO> getMembers(@PathVariable Long id) throws WorkspaceException {
        return workspaceService.getWorkspaceMembers(id);
    }
}
