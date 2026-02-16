package com.example.collab.services;

import com.example.collab.dtos.TaskDTO;
import com.example.collab.exceptions.TaskColumnException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;

import java.util.List;

public interface TaskService {

    TaskDTO saveTask(TaskDTO taskDTO) throws TaskException, UserNotFoundException;
    TaskDTO getTaskById(Long id) throws TaskException;
    TaskDTO getTaskByTitle(String title);
    TaskDTO updateTask(Long id , TaskDTO taskDTO) throws TaskException;
    TaskDTO deleteTask(Long id) throws TaskException;
    List<TaskDTO> getAllTasks();
    List<TaskDTO> getAllTasksByTaskColumn(Long taskColumnId) throws TaskColumnException;
    List<TaskDTO> getAllTasksByAssignee(Long assigneeId) throws UserNotFoundException;

    TaskDTO moveTask(Long taskId, Long targetColumnId) throws TaskException, TaskColumnException;
}
