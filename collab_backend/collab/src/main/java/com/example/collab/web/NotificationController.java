package com.example.collab.web;

import com.example.collab.dtos.NotificationDTO;
import com.example.collab.exceptions.NotificationExceptions;
import com.example.collab.services.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
@AllArgsConstructor
public class NotificationController {

    private NotificationService notificationService;

    @GetMapping("/notifications/unRead/{idNotification}")
    public List<NotificationDTO> getUnreadNotification(@PathVariable Long idNotification) throws NotificationExceptions {
        return notificationService.getUnreadNotification(idNotification);
    }

    @PostMapping("/notifications/markAsRead/{notificationId}")
    public void markedRead(@PathVariable Long notificationId) throws NotificationExceptions {
        notificationService.markedRead(notificationId);
    }
}
