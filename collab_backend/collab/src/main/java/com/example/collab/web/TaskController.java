package com.example.collab.web;


import com.example.collab.dtos.TaskDTO;
import com.example.collab.exceptions.TaskColumnException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.services.TaskService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class TaskController {

    private TaskService taskService;

    @PostMapping("/task")
    public TaskDTO saveTask(@RequestBody TaskDTO taskDTO) throws TaskException, UserNotFoundException {
        return taskService.saveTask(taskDTO);
    }

    @GetMapping("/task/{id}")
    public TaskDTO getTaskById(@PathVariable Long id) throws TaskException {
        return taskService.getTaskById(id);
    }

    @GetMapping("/task")
    public TaskDTO getTaskByTitle(@RequestParam(name = "title") String title) throws TaskException {
        return taskService.getTaskByTitle(title);
    }

    @PutMapping("/task/{id}")
    public TaskDTO updateTask(@PathVariable Long id ,@RequestBody TaskDTO taskDTO) throws TaskException {
        return taskService.updateTask(id , taskDTO);
    }

    @DeleteMapping("/task/{id}")
    public TaskDTO deleteTask(@PathVariable Long id) throws TaskException {
        return taskService.deleteTask(id);
    }

    @GetMapping("/tasks/all")
    public List<TaskDTO> getAllTasks() throws TaskException {
        return taskService.getAllTasks();
    }

    @GetMapping("/tasks/column/{taskColumnId}")
    public List<TaskDTO> getAllTasksByTaskColumn(@PathVariable Long taskColumnId) throws  TaskColumnException {
        return taskService.getAllTasksByTaskColumn(taskColumnId);
    }

    @GetMapping("/tasks/assignee/{assigneeId}")
    public List<TaskDTO> getAllTasksByAssigneeId(@PathVariable Long assigneeId) throws TaskColumnException, UserNotFoundException {
        return taskService.getAllTasksByAssignee(assigneeId);
    }

    @PutMapping("/tasks/{taskId}/{targetColumnId}")
    public TaskDTO moveTask(@PathVariable Long taskId ,@PathVariable Long targetColumnId) throws TaskColumnException, TaskException {
        return taskService.moveTask(taskId , targetColumnId);
    }
}
