package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
@Entity
public class ERP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String description;
    private String version;
    private String logoUrl; // <-- Ajoute ce champ

    @OneToMany(mappedBy = "erp", cascade = CascadeType.ALL)
    private Set<Connecteur> connecteurs = new HashSet<>();

}
