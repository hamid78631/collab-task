package com.example.collab.mappers;

import com.example.collab.dtos.NotificationDTO;
import com.example.collab.entities.Notification;
import com.example.collab.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class NotificationMappers {

    public Notification notifDTOtoNotif(NotificationDTO notificationDTO){

        Notification notification = new Notification();
        BeanUtils.copyProperties(notificationDTO, notification);

        if (notificationDTO.getOwnerNotification() != null) {
            User user = new User();
            user.setId(notificationDTO.getOwnerNotification());
            notification.setOwnerNotification(user);
        }

        return notification;
    }


    public NotificationDTO notifToNotifDTO(Notification notification){
        NotificationDTO notificationDTO = new NotificationDTO();
        BeanUtils.copyProperties(notification, notificationDTO);

        if(notification.getOwnerNotification()!=null){
            notificationDTO.setOwnerNotification(notification.getOwnerNotification().getId());
        }

        return notificationDTO;
    }
}
