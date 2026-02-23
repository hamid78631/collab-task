package com.example.collab.web;

import com.example.collab.dtos.CommentDTO;
import com.example.collab.exceptions.CommentException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.services.CommentService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@CrossOrigin("*")


@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class CommentController {

    private CommentService commentService;


    @PostMapping("/comment")
    public CommentDTO createComment(@RequestBody CommentDTO commentDTO) throws UserNotFoundException, TaskException {

        return commentService.saveComment(commentDTO);
    }

    @PutMapping("/comment/{id}")
    public CommentDTO updateComment(@PathVariable Long id , @RequestBody CommentDTO commentDTO) throws UserNotFoundException, TaskException, CommentException {
        return commentService.updateComment(id , commentDTO);
    }

    @DeleteMapping("/comment/{id}")
    public CommentDTO deleteComment(@PathVariable Long id) throws UserNotFoundException, TaskException, CommentException {
        return commentService.deleteComment(id);
    };

    @GetMapping("/comment/{id}")
    public CommentDTO getComment(@PathVariable Long id) throws UserNotFoundException, TaskException, CommentException {
        return commentService.getComment(id);
    }


    @GetMapping("/comments/task/{taskId}")
    public List<CommentDTO> getCommentByTask(@PathVariable Long taskId) throws UserNotFoundException, TaskException {

        return commentService.getCommentsByTask(taskId);
    }

    @GetMapping("/comments/User/{userId}")
    public List<CommentDTO> getCommentByUser(@PathVariable Long userId) throws UserNotFoundException, TaskException {

        return commentService.getCommentByUser(userId);
    }
}
