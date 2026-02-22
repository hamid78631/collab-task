package com.example.collab.mappers;

import com.example.collab.dtos.CommentDTO;
import com.example.collab.entities.Comment;
import com.example.collab.entities.Task;
import com.example.collab.entities.User;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.repositories.TaskRepository;
import com.example.collab.repositories.UserRepository;
import org.springframework.beans.BeanUtils;

public class CommentMappers {

    private UserRepository userRepository;
    private TaskRepository taskRepository;

    public CommentDTO commentToCommentDTO(Comment comment) throws TaskException, UserNotFoundException {
        CommentDTO commentDTO = new CommentDTO() ;

        BeanUtils.copyProperties(comment,commentDTO);

        User author = userRepository.findById(comment.getAuthor().getId()).orElseThrow(()-> new UserNotFoundException("User not found !"));
        commentDTO.setAuthorId(author.getId());

        Task task = taskRepository.findById(comment.getTask().getId()).orElseThrow(()->new TaskException("Task not found !"));
       // CommentDTO.setTaskId(task.getId());
        return commentDTO ;
    }

    public Comment commentDTOToComment(CommentDTO commentDTO){
        Comment comment = new Comment() ;
        BeanUtils.copyProperties(commentDTO,comment);
        return comment ;
    }
}
