package com.example.collab.mappers;

import com.example.collab.dtos.TaskDTO;
import com.example.collab.entities.Task;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class TaskMappers {

    public TaskDTO taskToTaskDTO(Task task){
        TaskDTO taskDTO = new TaskDTO() ;
        BeanUtils.copyProperties(task,taskDTO);

        if(task.getAssignee()!=null){
            taskDTO.setAssigneeId(task.getAssignee().getId());
        }

        if(task.getTaskColumn()!=null){
            taskDTO.setTaskColumnId(task.getTaskColumn().getId());
        }
        return taskDTO;
    }

    public Task taskDTOToTask(TaskDTO taskDTO){

        Task task = new Task();
        BeanUtils.copyProperties(taskDTO,task);

        return task;
    }
}
