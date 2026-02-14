package com.example.collab.mappers;

import com.example.collab.dtos.WorkspaceDTO;
import com.example.collab.entities.Workspace;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class WorkspaceMappers {

    public WorkspaceDTO workspaceToWorkspaceDTO(Workspace workspace) {
        if(workspace == null) return null;
        WorkspaceDTO workspaceDTO = new WorkspaceDTO();
        BeanUtils.copyProperties(workspace, workspaceDTO);
        if(workspace.getOwner() != null ){
            workspaceDTO.setOwnerId(workspace.getOwner().getId());
        }
        return workspaceDTO;
    }

    public Workspace workspaceDTOToWorkspace(WorkspaceDTO workspaceDTO) {
        if(workspaceDTO == null) return null;
        Workspace workspace = new Workspace();
        BeanUtils.copyProperties(workspaceDTO, workspace);
        return workspace ;
    }
}
