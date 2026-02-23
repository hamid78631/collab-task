package com.example.collab.services;

import com.example.collab.dtos.CommentDTO;
import com.example.collab.entities.Comment;
import com.example.collab.entities.Task;
import com.example.collab.entities.User;
import com.example.collab.exceptions.CommentException;
import com.example.collab.exceptions.TaskException;
import com.example.collab.exceptions.UserNotFoundException;
import com.example.collab.mappers.CommentMappers;
import com.example.collab.repositories.CommentRepository;
import com.example.collab.repositories.TaskRepository;
import com.example.collab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@AllArgsConstructor

public class CommentServiceImpl implements CommentService{

    private CommentMappers dtoMapper ;
    private TaskRepository taskRepository;
    private UserRepository userRepository;
    private CommentRepository commentRepository;


    @Override
    public CommentDTO saveComment(CommentDTO commentDTO) throws TaskException, UserNotFoundException {
        Comment comment = dtoMapper.commentDTOToComment(commentDTO);

        if(commentDTO.getTaskId() != null){
            Task task = taskRepository.findById(commentDTO.getTaskId()).orElseThrow(()-> new TaskException("Task not found"));
            comment.setTask(task);
        }

        if(commentDTO.getAuthorId() != null){
            User author = userRepository.findById(commentDTO.getAuthorId()).orElseThrow(()-> new UserNotFoundException("User not found"));
            comment.setAuthor(author);
        }
        Comment savedComment = commentRepository.save(comment);
        return dtoMapper.commentToCommentDTO(savedComment);
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) throws CommentException, UserNotFoundException, TaskException {
        Comment comment = commentRepository.findById(id).orElseThrow(()-> new CommentException("Comment not found !"));

        comment.setContent(commentDTO.getContent());

        Comment  updatedComment = commentRepository.save(comment);
        return dtoMapper.commentToCommentDTO(updatedComment);
    }

    @Override
    public CommentDTO deleteComment(Long id) throws CommentException, UserNotFoundException, TaskException {
        Comment comment = commentRepository.findById(id).orElseThrow(()-> new CommentException("Comment not found !"));

        commentRepository.delete(comment);

        return dtoMapper.commentToCommentDTO(comment);
    }

    @Override
    public CommentDTO getComment(Long id) throws UserNotFoundException, TaskException, CommentException {
        Comment comment = commentRepository.findById(id).orElseThrow(()-> new CommentException("Comment not found !"));

        return dtoMapper.commentToCommentDTO(comment);
    }

    @SneakyThrows
    @Override
    public List<CommentDTO> getCommentByUser(Long userId) throws UserNotFoundException {
        User user = userRepository.findById(userId).orElseThrow(()-> new UserNotFoundException("User Not found !"));

        List<Comment> comments = user.getComments();
        return comments.stream().map( comment -> {
            try {
                return dtoMapper.commentToCommentDTO(comment);
            } catch (TaskException e) {
                throw new RuntimeException(e);
            } catch (UserNotFoundException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    @SneakyThrows
    @Override
    public List<CommentDTO> getCommentsByTask(Long taskId) throws UserNotFoundException {
        Task task = taskRepository.findById(taskId).orElseThrow(()-> new TaskException("Task not found !"));

        List<Comment> comments = task.getComments();
        return comments.stream().map(comment-> {
            try {
                return dtoMapper.commentToCommentDTO(comment);
            } catch (TaskException e) {
                throw new RuntimeException(e);
            } catch (UserNotFoundException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }
}
