package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.GestionErreur;
import java.util.List;

public interface IGestionErreurService {
    GestionErreur saveGestionErreur(GestionErreur gestionErreur);
    List<GestionErreur> getAllGestionErreurs();
    GestionErreur getGestionErreurById(Long id);
    void deleteGestionErreur(Long id);
}
