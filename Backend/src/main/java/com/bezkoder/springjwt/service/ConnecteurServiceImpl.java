package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Connecteur;
import com.bezkoder.springjwt.repository.ConnecteurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConnecteurServiceImpl implements IConnecteurService {

    @Autowired
    private ConnecteurRepository connecteurRepository;

    @Override
    public Connecteur saveConnecteur(Connecteur connecteur) {
        return connecteurRepository.save(connecteur);
    }

    @Override
    public List<Connecteur> getAllConnecteurs() {
        return connecteurRepository.findAll();
    }

    @Override
    public Connecteur getConnecteurById(Long id) {
        return connecteurRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteConnecteur(Long id) {
        connecteurRepository.deleteById(id);
    }

    @Override
    public Connecteur updateConnecteur(Long id, Connecteur connecteurDetails) {

            Connecteur connecteur = getConnecteurById(id);
            if (connecteur != null) {
                connecteur.setNom(connecteurDetails.getNom());
                connecteur.setType(connecteurDetails.getType());
                connecteur.setConfiguration(connecteurDetails.getConfiguration());
                return saveConnecteur(connecteur);
            } else {
                throw new RuntimeException("Connecteur not found with id " + id);
            }

    }

    @Override
    public long countAllConnecteurs() {
        return connecteurRepository.count();

    }
}
