package com.example.collab.web;

import com.example.collab.dtos.TaskColumnDTO;
import com.example.collab.exceptions.TaskColumnException;
import com.example.collab.services.TaskColumnService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
@AllArgsConstructor

public class TaskColumnController {

    private TaskColumnService taskColumnService;

    @PostMapping("/taskColumn")
    public TaskColumnDTO createTaskColumn(@RequestBody TaskColumnDTO taskColumnDTO) {

        return taskColumnService.createColumn( taskColumnDTO);
    }

    @PutMapping("/taskColumn/{id}")
    public TaskColumnDTO updateTaskColumn(@PathVariable Long id ,@RequestBody TaskColumnDTO taskColumnDTO) throws TaskColumnException {

        return taskColumnService.updateColumn(id , taskColumnDTO);
    }

    @GetMapping("/taskColumn/{id}")
    public TaskColumnDTO getColumn(@PathVariable Long id ) throws TaskColumnException {
        return taskColumnService.getColumn(id);
    }

    @DeleteMapping("/taskColumn/{id}")
    public TaskColumnDTO deleteTaskColumn(@PathVariable Long id ) throws TaskColumnException {
        return taskColumnService.deleteColumn(id);
    }

    @GetMapping("taskColumns/all/{boardId}")
    public List<TaskColumnDTO> getColumnsByBoard(@PathVariable Long boardId) throws TaskColumnException {
        return taskColumnService.getColumnsByBoard(boardId);
    }

}
