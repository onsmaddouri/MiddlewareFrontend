package com.bezkoder.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class GenerateurFlux {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idGenerateur;

    private String nom;
    private String description;
    private String source;
    private String destination;
    private String format;
    private Date dateCreation;
    @PrePersist
    protected void onCreate() {
        // La date de création sera automatiquement définie lors de l'insertion de l'entité
        this.dateCreation = new Date();
    }
    @OneToMany(mappedBy = "generateurFlux", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Flux> flux = new HashSet<>();

    @ManyToOne
    private User utilisateur;

}
