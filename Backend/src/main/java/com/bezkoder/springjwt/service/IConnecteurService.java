package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Connecteur;
import java.util.List;

public interface IConnecteurService {
    Connecteur saveConnecteur(Connecteur connecteur);

    List<Connecteur> getAllConnecteurs();

    Connecteur getConnecteurById(Long id);

    void deleteConnecteur(Long id);

    Connecteur updateConnecteur(Long id, Connecteur connecteurDetails);
    long countAllConnecteurs();

}