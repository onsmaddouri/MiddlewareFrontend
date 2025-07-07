package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Webhook;
import com.bezkoder.springjwt.service.WebhookServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/webhooks")
@CrossOrigin(origins = "http://localhost:4200")
public class WebhookController {

    @Autowired
    private WebhookServiceImpl webhookService;

    @PostMapping
    public Webhook saveWebhook(@RequestBody Webhook webhook) {
        return webhookService.saveWebhook(webhook);
    }

    @GetMapping
    public List<Webhook> getAllWebhooks() {
        return webhookService.getAllWebhooks();
    }

    @GetMapping("/{id}")
    public Webhook getWebhookById(@PathVariable Long id) {
        return webhookService.getWebhookById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteWebhook(@PathVariable Long id) {
        webhookService.deleteWebhook(id);
    }
}
