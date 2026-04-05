package com.example.collab.mappers;

import com.example.collab.dtos.CommentDTO;
import com.example.collab.entities.Comment;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CommentMappers {

    public CommentDTO commentToCommentDTO(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        BeanUtils.copyProperties(comment, commentDTO);
        if (comment.getAuthor() != null) {
            commentDTO.setAuthorId(comment.getAuthor().getId());
        }
        if (comment.getTask() != null) {
            commentDTO.setTaskId(comment.getTask().getId());
        }
        return commentDTO;
    }

    public Comment commentDTOToComment(CommentDTO commentDTO) {
        Comment comment = new Comment();
        BeanUtils.copyProperties(commentDTO, comment);
        return comment;
    }
}
