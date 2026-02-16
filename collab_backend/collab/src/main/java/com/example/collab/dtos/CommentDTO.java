package com.example.collab.dtos;

import com.example.collab.entities.Task;
import com.example.collab.entities.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CommentDTO {

    private Long id ;
    private String content ;

    private LocalDateTime createdAt ;

    private Long taskId ;

    //user
    private Long authorId ;

}
