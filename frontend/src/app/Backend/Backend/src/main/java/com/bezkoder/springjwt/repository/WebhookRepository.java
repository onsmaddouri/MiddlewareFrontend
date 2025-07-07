package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bezkoder.springjwt.models.Webhook;

@Repository
public interface WebhookRepository extends JpaRepository<Webhook, Long> {
}
