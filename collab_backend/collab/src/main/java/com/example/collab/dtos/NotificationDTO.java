package com.example.collab.dtos;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class NotificationDTO {

    private Long id;

    private String message ;
    private LocalDateTime createdAt;
    private boolean isRead =false ;

    private String type;
    private Long taskId;
    private Long boardId;
    private Long ownerNotification;
}
