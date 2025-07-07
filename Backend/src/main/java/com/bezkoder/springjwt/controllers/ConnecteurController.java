package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Connecteur;
import com.bezkoder.springjwt.service.ConnecteurServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/connecteurs")
@CrossOrigin(origins = "http://localhost:4200")
public class ConnecteurController {

    @Autowired
    private ConnecteurServiceImpl connecteurService;

    @PostMapping("/add")
    public Connecteur saveConnecteur(@RequestBody Connecteur connecteur) {
        return connecteurService.saveConnecteur(connecteur);
    }

    @GetMapping("/all")
    public List<Connecteur> getAllConnecteurs() {
        return connecteurService.getAllConnecteurs();
    }

    @GetMapping("/{id}")
    public Connecteur getConnecteurById(@PathVariable Long id) {
        return connecteurService.getConnecteurById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteConnecteur(@PathVariable Long id) {
        connecteurService.deleteConnecteur(id);
    }
    @PutMapping("/{id}")
    public Connecteur updateConnecteur(@PathVariable Long id, @RequestBody Connecteur connecteurDetails) {
        return connecteurService.updateConnecteur(id, connecteurDetails);
    }
    @GetMapping("/count")
    public long countAllConnecteurs() {
        return connecteurService.countAllConnecteurs();
    }

}
