package com.example.collab.services;


import com.example.collab.dtos.NotificationDTO;
import com.example.collab.entities.Notification;
import com.example.collab.entities.User;
import com.example.collab.exceptions.NotificationExceptions;

import com.example.collab.mappers.NotificationMappers;
import com.example.collab.repositories.NotificationRepository;
import com.example.collab.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class NotificationsServiceImpl implements NotificationService{

    private NotificationRepository notificationRepository;
    private NotificationMappers dtoMapper ;
    private UserRepository userRepository;

    public List<NotificationDTO> getUnreadNotification(Long idNotification) throws NotificationExceptions {

        List<Notification> notifications = notificationRepository.findByOwnerNotificationIdAndIsReadFalseOrderByCreatedAtDesc(idNotification);
        return notifications.stream().map(notification -> dtoMapper.notifToNotifDTO(notification)).toList();
    }

    public void markedRead(Long notificationId) throws NotificationExceptions {
        Notification notification= notificationRepository.findById(notificationId).orElseThrow(() -> new NotificationExceptions("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void createNotification(Long userId, String message, String type, Long taskId, Long boardId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setOwnerNotification(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTaskId(taskId);
        notification.setBoardId(boardId);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
