package com.example.collab.services;

import com.example.collab.dtos.UserDTO;
import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.exceptions.WorkspaceException;

import java.util.List;

public interface WorkspaceService {

    List<WorkspaceDTO> getAllWorkspaces();
    WorkspaceDTO getWorkspaceBySlug(String slug) throws WorkspaceException;
    WorkspaceDTO getWorkspaceById(Long id) throws WorkspaceException;
    WorkspaceDTO updateWorkspace(WorkspaceDTO workspaceDTO , Long id) throws WorkspaceException, UserNotFoundException;
    WorkspaceDTO saveWorkspace(WorkspaceDTO workspaceDTO) throws WorkspaceException, UserNotFoundException;
    WorkspaceDTO deleteWorkspace(Long id) throws WorkspaceException;
    void addMember(Long workspaceId , Long userId) throws UserNotFoundException, WorkspaceException;
    void removeMember(Long workspaceId , Long userId) throws UserNotFoundException, WorkspaceException;
    List<UserDTO> getWorkspaceMembers(Long workspaceId) throws WorkspaceException;
}
