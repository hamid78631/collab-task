package com.example.collab.web;

import com.example.collab.dtos.LabelDTO;
import com.example.collab.dtos.TaskDTO;
import com.example.collab.exceptions.LabelException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.WorkspaceException;
import com.example.collab.services.LabelService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Transactional
@RestController
@AllArgsConstructor
@RequestMapping("api/labels")
public class LabelController {

    private final LabelService labelService;

    @PostMapping
    public LabelDTO createLabel(@RequestBody LabelDTO labelDTO) throws WorkspaceException {
        return labelService.createLabel(labelDTO);
    }

    @GetMapping("/workspace/{workspaceId}")
    public List<LabelDTO> getLabelsByWorkspace(@PathVariable Long workspaceId) {
        return labelService.getLabelsByWorkspace(workspaceId);
    }

    @PostMapping("/task/{taskId}/add/{labelId}")
    public TaskDTO addLabelToTask(@PathVariable Long taskId, @PathVariable Long labelId)
            throws LabelException, TaskException {
        return labelService.addLabelToTask(taskId, labelId);
    }

    @DeleteMapping("/task/{taskId}/remove/{labelId}")
    public TaskDTO removeLabelFromTask(@PathVariable Long taskId, @PathVariable Long labelId)
            throws LabelException, TaskException {
        return labelService.removeLabelToTask(taskId, labelId);
    }
}