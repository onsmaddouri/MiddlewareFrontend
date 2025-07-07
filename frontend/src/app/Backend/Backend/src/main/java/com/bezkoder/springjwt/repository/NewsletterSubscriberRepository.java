package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bezkoder.springjwt.models.NewsletterSubscriber;
public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {
    boolean existsByEmail(String email);
}