package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
@Entity
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idService;

    private String nom;

    @Enumerated(EnumType.STRING)
    private TypeService typeService;

    private String statut;
    private Date dateCreation;

    @OneToMany(mappedBy = "service", cascade = CascadeType.ALL)
    private Set<ServiceModule> modules = new HashSet<>();

    @ManyToMany(mappedBy = "serviceEntities")
    private Set<Flux> flux = new HashSet<>();

}
