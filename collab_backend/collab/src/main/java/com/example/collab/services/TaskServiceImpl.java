package com.example.collab.services;

import com.example.collab.dtos.TaskDTO;
import com.example.collab.entities.Task;
import com.example.collab.entities.TaskColumn;
import com.example.collab.entities.User;
import com.example.collab.exceptions.TaskColumnException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.mappers.TaskMappers;
import com.example.collab.repositories.TaskColumnRepository;
import com.example.collab.repositories.TaskRepository;
import com.example.collab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor

public class TaskServiceImpl implements TaskService {

    private TaskMappers dtoMapper ;
    private TaskRepository taskRepository;
    private TaskColumnRepository taskColumnRepository;
    private UserRepository userRepository;

    @Override
    public TaskDTO saveTask(TaskDTO taskDTO) throws TaskException, UserNotFoundException {
        Task task = dtoMapper.taskDTOToTask(taskDTO);

        TaskColumn taskColumn = taskColumnRepository.findById(taskDTO.getTaskColumnId()).orElseThrow(()->new TaskException("TaskColumn not found"));
        task.setTaskColumn(taskColumn);

        if (taskDTO.getAssigneeId() != null) {
            User assignee = userRepository.findById(taskDTO.getAssigneeId())
                    .orElseThrow(() -> new UserNotFoundException("User not found ! "));
            task.setAssignee(assignee);
        }
        taskRepository.save(task);
        return dtoMapper.taskToTaskDTO(task);
    }

    @Override
    public TaskDTO getTaskById(Long id) throws TaskException {
        Task task = taskRepository.findById(id).orElseThrow(()-> new TaskException("Task not found !"));

        return dtoMapper.taskToTaskDTO(task);
    }

    @Override
    public TaskDTO getTaskByTitle(String title) {
        Task task = taskRepository.findByTitle(title);

        return dtoMapper.taskToTaskDTO(task);
    }

    @Override
    public TaskDTO updateTask(Long id, TaskDTO taskDTO) throws TaskException {
        Task task = taskRepository.findById(id).orElseThrow(()-> new TaskException("Task not found"));

        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setPosition(taskDTO.getPosition());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());

        taskRepository.save(task);

        return dtoMapper.taskToTaskDTO(task);
    }

    @Override
    public TaskDTO deleteTask(Long id) throws TaskException {
        Task task = taskRepository.findById(id).orElseThrow(()-> new TaskException("Task not found"));
        taskRepository.delete(task);

        return dtoMapper.taskToTaskDTO(task);
    }

    @Override
    public List<TaskDTO> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();

        return tasks.stream().map(task-> dtoMapper.taskToTaskDTO(task)).toList();
    }

    @Override
    public List<TaskDTO> getAllTasksByTaskColumn(Long taskColumnId) throws TaskColumnException {
        TaskColumn taskColumn = taskColumnRepository.findById(taskColumnId).orElseThrow(()-> new TaskColumnException("TaskColumn not found"));

        List<Task> tasks = taskColumn.getTasks();
        return tasks.stream().map(task-> dtoMapper.taskToTaskDTO(task)).toList();
    }

    @Override
    public List<TaskDTO> getAllTasksByAssignee(Long assigneeId) throws UserNotFoundException {
        User assignee = userRepository.findById(assigneeId).orElseThrow(()-> new UserNotFoundException("User not found"));

        List<Task> tasks = assignee.getTasks();
        return tasks.stream().map(task-> dtoMapper.taskToTaskDTO(task)).toList();
    }

    @Override
    public TaskDTO moveTask(Long taskId, Long targetColumnId) throws TaskException, TaskColumnException {

        Task task = taskRepository.findById(taskId).orElseThrow(()-> new TaskException("Task not found"));
        TaskColumn taskColumn = taskColumnRepository.findById(targetColumnId).orElseThrow(()-> new TaskColumnException("TaskColumn not found"));
        task.setTaskColumn(taskColumn);
        taskRepository.save(task);

        return dtoMapper.taskToTaskDTO(task);
    }
}
