package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idNotification;

    private String titre;
    private String message;

    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    private Date dateEnvoi;
    private String statut;
    private String source;

    @OneToOne(cascade = CascadeType.ALL)
    private Webhook webhook;

    @ManyToOne
    @JsonBackReference
    private Flux flux;
}
