package com.example.collab.repositories;

import com.example.collab.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByOwnerNotificationIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);
}
