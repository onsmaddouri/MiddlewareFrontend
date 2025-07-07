package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@Entity
public class GestionErreur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idErreur;

    private String codeErreur;
    private String description;
    private Date dateDetection;
    private String fluxConcerne;
    private String utilisateurResponsable;

    @ManyToOne
    private Flux flux;

}
