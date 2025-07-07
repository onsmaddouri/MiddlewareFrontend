package com.bezkoder.springjwt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@Entity
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;

    private Date dateHeure;

    @Enumerated(EnumType.STRING)
    private NiveauLog niveau;

    private String message;
    private String source;

    @ManyToOne
    private Flux flux;

}
