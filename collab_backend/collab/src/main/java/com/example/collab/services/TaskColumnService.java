package com.example.collab.services;


import com.example.collab.dtos.TaskColumnDTO;
import com.example.collab.exceptions.TaskColumnException;
import org.springframework.stereotype.Service;

import java.util.List;


public interface TaskColumnService {

    TaskColumnDTO createColumn(TaskColumnDTO taskColumnDTO);


    TaskColumnDTO updateColumn(Long id, TaskColumnDTO taskColumnDTO) throws TaskColumnException;

    TaskColumnDTO deleteColumn(Long id ) throws TaskColumnException;
    TaskColumnDTO getColumn(Long id) throws TaskColumnException;
    List<TaskColumnDTO> getColumnsByBoard(Long boardId) throws TaskColumnException;
}
