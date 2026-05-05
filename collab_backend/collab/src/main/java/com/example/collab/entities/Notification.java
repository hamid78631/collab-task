package com.example.collab.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "notifications")
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String message ;
    private LocalDateTime createdAt;
    private boolean isRead =false ;

    private String type;
    private Long taskId;
    private Long boardId;

    @ManyToOne
    private User ownerNotification;
}
