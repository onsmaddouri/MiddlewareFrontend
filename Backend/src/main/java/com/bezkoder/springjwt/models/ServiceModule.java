package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ServiceModule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idModule;

    private String nom;
    private String version;
    private String typeModule;
    private String statut;

    @ManyToOne
    @JoinColumn(name = "service_id")
    private ServiceEntity service;
}
