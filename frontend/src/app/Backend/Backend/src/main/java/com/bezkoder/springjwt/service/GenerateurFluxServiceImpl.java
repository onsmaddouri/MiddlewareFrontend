package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.GenerateurFlux;
import com.bezkoder.springjwt.repository.GenerateurFluxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GenerateurFluxServiceImpl implements IGenerateurFluxService {

    @Autowired
    private GenerateurFluxRepository generateurFluxRepository;

    @Override
    public GenerateurFlux saveGenerateurFlux(GenerateurFlux generateurFlux) {
        return generateurFluxRepository.save(generateurFlux);
    }

    @Override
    public List<GenerateurFlux> getAllGenerateurFlux() {
        return generateurFluxRepository.findAll();
    }

    @Override
    public GenerateurFlux getGenerateurFluxById(Long id) {
        return generateurFluxRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteGenerateurFlux(Long id) {
        generateurFluxRepository.deleteById(id);
    }

    @Override
    public GenerateurFlux updateGenerateur(Long id, GenerateurFlux generateurDetails) {

        GenerateurFlux generateurFlux = getGenerateurFluxById(id);
        if (generateurFlux != null) {
            generateurFlux.setNom(generateurDetails.getNom());
            generateurFlux.setDescription(generateurDetails.getDescription());
            generateurFlux.setSource(generateurDetails.getSource());
            generateurFlux.setDestination(generateurDetails.getDestination());
            generateurFlux.setFormat(generateurDetails.getFormat());

            return saveGenerateurFlux(generateurFlux);

        } else {
            throw new RuntimeException("ERP not found with id " + id);
        }
    }

    @Override
    public long countAllGenerateurs() {
        return generateurFluxRepository.count();

    }
}
