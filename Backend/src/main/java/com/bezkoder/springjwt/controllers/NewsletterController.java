package com.bezkoder.springjwt.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bezkoder.springjwt.service.NewsletterService;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/newsletter")
@CrossOrigin(origins = "http://localhost:4200")
public class NewsletterController {
    @Autowired
    private NewsletterService newsletterService;

    @PostMapping("/subscribe")
    public ResponseEntity<?> subscribe(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Map<String, String> response = new HashMap<>();

        if (email == null || email.isEmpty()) {
            response.put("message", "Email manquant");
            response.put("status", "error");
            return ResponseEntity.badRequest().body(response);
        }

        boolean success = newsletterService.subscribe(email);
        if (!success) {
            response.put("message", "Cet email est déjà inscrit.");
            response.put("status", "error");
            return ResponseEntity.status(409).body(response);
        }

        response.put("message", "Inscription réussie, un email de confirmation a été envoyé.");
        response.put("status", "success");
        return ResponseEntity.ok(response);
    }
}