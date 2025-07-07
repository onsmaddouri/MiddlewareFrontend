package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.GenerateurFlux;
import java.util.List;

public interface IGenerateurFluxService {
    GenerateurFlux saveGenerateurFlux(GenerateurFlux generateurFlux);
    List<GenerateurFlux> getAllGenerateurFlux();
    GenerateurFlux getGenerateurFluxById(Long id);
    void deleteGenerateurFlux(Long id);
    GenerateurFlux updateGenerateur(Long id, GenerateurFlux generateurDetails);
    long countAllGenerateurs();

}
