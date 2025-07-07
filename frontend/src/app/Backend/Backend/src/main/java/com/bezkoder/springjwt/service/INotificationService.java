package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Notification;
import java.util.List;

public interface INotificationService {
    Notification saveNotification(Notification notification);
    List<Notification> getAllNotifications();
    Notification getNotificationById(Long id);
    void deleteNotification(Long id);
}
