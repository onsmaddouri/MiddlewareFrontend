package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Webhook;
import java.util.List;

public interface IWebhookService {
    Webhook saveWebhook(Webhook webhook);
    List<Webhook> getAllWebhooks();
    Webhook getWebhookById(Long id);
    void deleteWebhook(Long id);
}
