package com.example.collab.web;

import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.dtos.WorkspaceMemberDTO;
import com.example.collab.enums.WorkspaceRole;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.services.WorkspaceMemberService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Transactional
@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class WorksController {

    private WorkspaceMemberService workspaceMemberService;

    @GetMapping("/workspaces")
    public List<WorkspaceDTO> getWorkspaces() {
        return workspaceMemberService.getAllWorkspaces();
    }

    @GetMapping("/workspaces/{id}")
    public WorkspaceDTO getWorkspaceById(@PathVariable Long id) throws WorkspaceException {
        return workspaceMemberService.getWorkspaceById(id);
    }

    @GetMapping("/workspaces/slug/{slug}")
    public WorkspaceDTO getWorkspace(@PathVariable String slug) throws WorkspaceException {
        return workspaceMemberService.getWorkspaceBySlug(slug);
    }

    @PostMapping("/workspaces")
    public WorkspaceDTO createWorkspace(@RequestBody WorkspaceDTO workspaceDTO) throws WorkspaceException, UserNotFoundException {
        return workspaceMemberService.saveWorkspace(workspaceDTO);
    }

    @PutMapping("/workspaces/{id}")
    public WorkspaceDTO updateWorkspace(@RequestBody WorkspaceDTO workspaceDTO, @PathVariable Long id) throws WorkspaceException, UserNotFoundException {
        return workspaceMemberService.updateWorkspace(workspaceDTO, id);
    }

    @DeleteMapping("/workspaces/{id}")
    public WorkspaceDTO deleteWorkspace(@PathVariable Long id) throws WorkspaceException, UserNotFoundException {
        return workspaceMemberService.deleteWorkspace(id);
    }

    @PostMapping("/workspaces/{workspaceId}/members/{userId}")
    public void addMember(@PathVariable Long workspaceId, @PathVariable Long userId) throws UserNotFoundException, WorkspaceException {
        workspaceMemberService.addMember(workspaceId, userId);
    }

    @DeleteMapping("/workspaces/{workspaceId}/members/{userId}")
    public void removeMember(@PathVariable Long workspaceId, @PathVariable Long userId) throws UserNotFoundException, WorkspaceException {
        workspaceMemberService.removeMember(workspaceId, userId);
    }

    @GetMapping("/workspaces/{id}/members")
    public List<WorkspaceMemberDTO> getMembers(@PathVariable Long id) throws WorkspaceException {
        return workspaceMemberService.getWorkspaceMembers(id);
    }

    @GetMapping("/workspaces/user/{userId}")
    public List<WorkspaceDTO> getWorkspacesByUser(@PathVariable Long userId) throws WorkspaceException {
        return workspaceMemberService.getWorkspacesByUser(userId);
    }

    @PutMapping("/workspaces/{workspaceId}/members/{userId}/role")
    public void changeRole(@PathVariable Long workspaceId,
                           @PathVariable Long userId,
                           @RequestParam String role) throws UserNotFoundException, WorkspaceException {
        workspaceMemberService.changeRole(workspaceId, userId, WorkspaceRole.valueOf(role));
    }
}