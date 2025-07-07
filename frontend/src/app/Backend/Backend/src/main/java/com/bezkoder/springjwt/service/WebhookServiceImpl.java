package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Webhook;
import com.bezkoder.springjwt.repository.WebhookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WebhookServiceImpl implements IWebhookService {

    @Autowired
    private WebhookRepository webhookRepository;

    @Override
    public Webhook saveWebhook(Webhook webhook) {
        return webhookRepository.save(webhook);
    }

    @Override
    public List<Webhook> getAllWebhooks() {
        return webhookRepository.findAll();
    }

    @Override
    public Webhook getWebhookById(Long id) {
        return webhookRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteWebhook(Long id) {
        webhookRepository.deleteById(id);
    }
}
