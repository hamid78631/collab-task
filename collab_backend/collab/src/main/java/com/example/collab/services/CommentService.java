package com.example.collab.services;

import com.example.collab.dtos.CommentDTO;
import com.example.collab.exceptions.CommentException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;

import java.util.List;

public interface CommentService {

    CommentDTO saveComment(CommentDTO commentDTO) throws TaskException, UserNotFoundException;

    CommentDTO updateComment(Long id ,CommentDTO commentDTO) throws CommentException, UserNotFoundException, TaskException;

    CommentDTO deleteComment(Long id ) throws CommentException, UserNotFoundException, TaskException;

    CommentDTO getComment(Long id);

    List<CommentDTO> getCommentByUser(Long userId );

    List<CommentDTO> getCommentsByTask(Long taskId);
}
