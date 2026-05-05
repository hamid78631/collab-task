package com.example.collab.mappers;

import com.example.collab.dtos.LabelDTO;
import com.example.collab.dtos.TaskDTO;
import com.example.collab.entities.Task;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskMappers {

    public TaskDTO taskToTaskDTO(Task task){
        TaskDTO taskDTO = new TaskDTO() ;
        BeanUtils.copyProperties(task,taskDTO);

        if(task.getDueDate() != null){
            taskDTO.setDueDate(task.getDueDate().toLocalDate());
        }

        if(task.getAssignee()!=null){
            taskDTO.setAssigneeId(task.getAssignee().getId());
        }

        if(task.getTaskColumn()!=null){
            taskDTO.setTaskColumnId(task.getTaskColumn().getId());
            if(task.getTaskColumn().getBoard()!=null){
                taskDTO.setBoardId(task.getTaskColumn().getBoard().getId());
            }
        }

        if(task.getLabels() != null){
            List<LabelDTO> labelDTOs = task.getLabels().stream().map(label -> {
                LabelDTO dto = new LabelDTO();
                dto.setId(label.getId());
                dto.setName(label.getName());
                dto.setColor(label.getColor());
                return dto;
            }).collect(Collectors.toList());
            taskDTO.setLabels(labelDTOs);
        }

        return taskDTO;
    }

    public Task taskDTOToTask(TaskDTO taskDTO){

        Task task = new Task();
        BeanUtils.copyProperties(taskDTO,task);

        if(taskDTO.getDueDate() != null){
            task.setDueDate(taskDTO.getDueDate().atStartOfDay());
        }

        return task;
    }
}
