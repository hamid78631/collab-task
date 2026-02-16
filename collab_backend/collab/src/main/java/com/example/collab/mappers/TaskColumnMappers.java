package com.example.collab.mappers;

import com.example.collab.dtos.TaskColumnDTO;
import com.example.collab.entities.TaskColumn;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class TaskColumnMappers {

    public TaskColumnDTO taskColumnToDTO(TaskColumn taskColumn){
        TaskColumnDTO dto = new TaskColumnDTO();
        BeanUtils.copyProperties(taskColumn,dto);

        if(taskColumn.getBoard()!=null){
            dto.setBoardId(taskColumn.getBoard().getId());
        }

        return dto;
    }


    public TaskColumn taskColumnDTOToEntity(TaskColumnDTO dto){
        TaskColumn taskColumn = new TaskColumn();
        BeanUtils.copyProperties(dto,taskColumn);

        return taskColumn;
    }
}
