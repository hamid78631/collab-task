package com.example.collab.services;

import com.example.collab.dtos.NotificationDTO;
import com.example.collab.exceptions.NotificationExceptions;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;


public interface NotificationService {

    List<NotificationDTO> getUnreadNotification(Long idNotification) throws NotificationExceptions;

    void markedRead(Long notificationId) throws NotificationExceptions;

    void createNotification(Long userId, String message, String type);

}
