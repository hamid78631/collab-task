package com.example.collab.services;

import com.example.collab.dtos.LabelDTO;
import com.example.collab.dtos.TaskDTO;
import com.example.collab.exceptions.LabelException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.WorkspaceException;
import java.util.List;

public interface LabelService {
    LabelDTO createLabel(LabelDTO labelDTO) throws WorkspaceException;
    List<LabelDTO> getLabelsByWorkspace(Long workspaceId);
    TaskDTO addLabelToTask(Long taskId, Long labelId) throws LabelException , TaskException;
    TaskDTO removeLabelToTask(Long taskId , Long labelId) throws LabelException ,TaskException;
}
