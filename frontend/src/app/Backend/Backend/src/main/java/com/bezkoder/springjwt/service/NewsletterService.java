package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.NewsletterSubscriber;
import com.bezkoder.springjwt.repository.NewsletterSubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class NewsletterService {
    @Autowired
    private NewsletterSubscriberRepository repository;

    @Autowired
    private JavaMailSender mailSender;

    public boolean subscribe(String email) {
        if (repository.existsByEmail(email)) {
            return false;
        }
        NewsletterSubscriber subscriber = new NewsletterSubscriber();
        subscriber.setEmail(email);
        repository.save(subscriber);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Confirmation d'abonnement à la newsletter");
        message.setText("Merci pour votre inscription à notre newsletter !");
        mailSender.send(message);

        return true;
    }
}