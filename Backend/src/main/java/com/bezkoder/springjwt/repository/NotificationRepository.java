package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bezkoder.springjwt.models.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
