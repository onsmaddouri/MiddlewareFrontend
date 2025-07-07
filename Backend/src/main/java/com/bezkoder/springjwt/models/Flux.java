package com.bezkoder.springjwt.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;
@Getter
@Setter
@Entity
public class Flux {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFlux;
    @Column(unique = true)
    private String nomFlux;
    private String typeFlux;
    @DateTimeFormat
    private Date dateCreation;

    @Enumerated(EnumType.STRING)
    private StatutFlux statut;

    private boolean archived;
    private boolean validated;
    private boolean cancelled;

    private String modifiedBy;

    @ManyToOne
    private Connecteur connecteur;

    @ManyToOne
    private GenerateurFlux generateurFlux;

    @OneToMany(mappedBy = "flux", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Set<Notification> notifications = new HashSet<>();
    @OneToMany(mappedBy = "flux", cascade = CascadeType.ALL)
    private Set<Log> logs = new HashSet<>();

    @OneToMany(mappedBy = "flux", cascade = CascadeType.ALL)
    private Set<GestionErreur> erreurs = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "flux_services",
            joinColumns = @JoinColumn(name = "flux_id"),
            inverseJoinColumns = @JoinColumn(name = "service_id"))
    private Set<ServiceEntity> serviceEntities = new HashSet<>();


    public Long getIdFlux() {
        return idFlux;
    }

    public void setIdFlux(Long idFlux) {
        this.idFlux = idFlux;
    }

    public String getNomFlux() {
        return nomFlux;
    }

    public void setNomFlux(String nomFlux) {
        this.nomFlux = nomFlux;
    }

    public String getTypeFlux() {
        return typeFlux;
    }

    public void setTypeFlux(String typeFlux) {
        this.typeFlux = typeFlux;
    }

    public Date getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(Date dateCreation) {
        this.dateCreation = dateCreation;
    }

    public StatutFlux getStatut() {
        return statut;
    }

    public void setStatut(StatutFlux statut) {
        this.statut = statut;
    }

    public boolean isArchived() {
        return archived;
    }

    public void setArchived(boolean archived) {
        this.archived = archived;
    }

    public boolean isValidated() {
        return validated;
    }

    public void setValidated(boolean validated) {
        this.validated = validated;
    }

    public boolean isCancelled() {
        return cancelled;
    }

    public void setCancelled(boolean cancelled) {
        this.cancelled = cancelled;
    }

    public String getModifiedBy() {
        return modifiedBy;
    }

    public void setModifiedBy(String modifiedBy) {
        this.modifiedBy = modifiedBy;
    }

    public Set<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(Set<Notification> notifications) {
        this.notifications = notifications;
    }

    public Set<Log> getLogs() {
        return logs;
    }

    public void setLogs(Set<Log> logs) {
        this.logs = logs;
    }

    public Set<GestionErreur> getErreurs() {
        return erreurs;
    }

    public void setErreurs(Set<GestionErreur> erreurs) {
        this.erreurs = erreurs;
    }

    public Set<ServiceEntity> getServiceEntities() {
        return serviceEntities;
    }

    public void setServiceEntities(Set<ServiceEntity> serviceEntities) {
        this.serviceEntities = serviceEntities;
    }
    public Connecteur getConnecteur() {
        return connecteur;
    }

    public void setConnecteur(Connecteur connecteur) {
        this.connecteur = connecteur;
    }

    public GenerateurFlux getGenerateurFlux() {
        return generateurFlux;
    }

    public void setGenerateurFlux(GenerateurFlux generateurFlux) {
        this.generateurFlux = generateurFlux;
    }
}
