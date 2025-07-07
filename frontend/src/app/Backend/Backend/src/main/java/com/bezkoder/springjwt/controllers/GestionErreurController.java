package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.GestionErreur;
import com.bezkoder.springjwt.service.GestionErreurServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/erreurs")
@CrossOrigin(origins = "http://localhost:4200")
public class GestionErreurController {

    @Autowired
    private GestionErreurServiceImpl gestionErreurService;

    @PostMapping
    public GestionErreur saveGestionErreur(@RequestBody GestionErreur gestionErreur) {
        return gestionErreurService.saveGestionErreur(gestionErreur);
    }

    @GetMapping
    public List<GestionErreur> getAllGestionErreurs() {
        return gestionErreurService.getAllGestionErreurs();
    }

    @GetMapping("/{id}")
    public GestionErreur getGestionErreurById(@PathVariable Long id) {
        return gestionErreurService.getGestionErreurById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteGestionErreur(@PathVariable Long id) {
        gestionErreurService.deleteGestionErreur(id);
    }
}
