package com.example.collab.entities;

import com.example.collab.enums.EnumPriority;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name ="tasks")
public class Task {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    private String title ;
    @Column(columnDefinition = "TEXT")
    private String description ;

    @Enumerated(EnumType.STRING)
    private EnumPriority priority ;
    private Integer position ;
    @CreationTimestamp
    private LocalDateTime createdAt ;
    @CreationTimestamp
    private LocalDateTime dueDate ;

    @ManyToOne
    @JoinColumn(name = "taskColumn_id" , nullable = false)
    private TaskColumn taskColumn ;

    @OneToMany(mappedBy = "task",cascade = CascadeType.REMOVE)
    private List<Comment> comments ;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee ;
}
