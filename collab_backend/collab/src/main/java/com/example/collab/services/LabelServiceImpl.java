package com.example.collab.services;

import com.example.collab.dtos.LabelDTO;
import com.example.collab.dtos.TaskDTO;
import com.example.collab.entities.Label;
import com.example.collab.entities.Task;
import com.example.collab.entities.Workspace;
import com.example.collab.exceptions.LabelException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.mappers.LabelsMappers;
import com.example.collab.mappers.TaskMappers;
import com.example.collab.repositories.LabelRepository;
import com.example.collab.repositories.TaskRepository;
import com.example.collab.repositories.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelServiceImpl implements LabelService {

    private final LabelsMappers labelsMappers;
    private final LabelRepository labelRepository;
    private final TaskRepository taskRepository;
    private final TaskMappers taskMappers;
    private final WorkspaceRepository workspaceRepository;

    @Override
    public LabelDTO createLabel(LabelDTO labelDTO) throws WorkspaceException {
        Workspace workspace = workspaceRepository.findById(labelDTO.getWorkspaceId())
                .orElseThrow(() -> new WorkspaceException("Workspace Not Found !"));
        Label label = new Label();
        label.setName(labelDTO.getName());
        label.setColor(labelDTO.getColor());
        label.setWorkspace(workspace);
        return labelsMappers.labelToLabelDTO(labelRepository.save(label));
    }

    @Override
    public List<LabelDTO> getLabelsByWorkspace(Long workspaceId) {
        return labelRepository.findByWorkspaceId(workspaceId)
                .stream()
                .map(labelsMappers::labelToLabelDTO)
                .toList();
    }

    @Override
    public TaskDTO addLabelToTask(Long taskId, Long labelId) throws LabelException, TaskException {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new LabelException("Label Not found !"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskException("Task not found !"));
        task.getLabels().add(label);
        return taskMappers.taskToTaskDTO(taskRepository.save(task));
    }

    @Override
    public TaskDTO removeLabelToTask(Long taskId, Long labelId) throws LabelException, TaskException {
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new LabelException("Label Not found !"));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskException("Task not found !"));
        task.getLabels().remove(label);
        return taskMappers.taskToTaskDTO(taskRepository.save(task));
    }
}