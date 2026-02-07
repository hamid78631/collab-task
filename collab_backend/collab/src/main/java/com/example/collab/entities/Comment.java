package com.example.collab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name ="comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String content ;
    @CreationTimestamp
    private LocalDateTime createdAt ;

    @ManyToOne
    @JoinColumn(name = "task_id" , nullable = false)
    private Task task ;

    @ManyToOne
    @JoinColumn(name = "author_id" , nullable = false)
    private User author ;

}
