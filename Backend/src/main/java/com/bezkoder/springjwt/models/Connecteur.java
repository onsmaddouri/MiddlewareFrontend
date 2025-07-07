package com.bezkoder.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
public class Connecteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String type;
    private String configuration;
    private String statut;

    @ManyToOne
    private ApplicationOpenSource applicationOpenSource;

    @ManyToOne
    private ERP erp;

    @OneToMany(mappedBy = "connecteur", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Flux> flux = new HashSet<>();

}
