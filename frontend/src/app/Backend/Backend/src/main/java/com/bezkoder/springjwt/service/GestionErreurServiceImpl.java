package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.GestionErreur;
import com.bezkoder.springjwt.repository.GestionErreurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GestionErreurServiceImpl implements IGestionErreurService {

    @Autowired
    private GestionErreurRepository gestionErreurRepository;

    @Override
    public GestionErreur saveGestionErreur(GestionErreur gestionErreur) {
        return gestionErreurRepository.save(gestionErreur);
    }

    @Override
    public List<GestionErreur> getAllGestionErreurs() {
        return gestionErreurRepository.findAll();
    }

    @Override
    public GestionErreur getGestionErreurById(Long id) {
        return gestionErreurRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteGestionErreur(Long id) {
        gestionErreurRepository.deleteById(id);
    }
}
