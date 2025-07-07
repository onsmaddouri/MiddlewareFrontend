package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.GenerateurFlux;
import com.bezkoder.springjwt.service.GenerateurFluxServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generateurs")
@CrossOrigin(origins = "http://localhost:4200")
public class GenerateurFluxController {

    @Autowired
    private GenerateurFluxServiceImpl generateurFluxService;

    @PostMapping("/add")
    public GenerateurFlux saveGenerateurFlux(@RequestBody GenerateurFlux generateurFlux) {
        return generateurFluxService.saveGenerateurFlux(generateurFlux);
    }

    @GetMapping("/all")
    public List<GenerateurFlux> getAllGenerateurFlux() {
        return generateurFluxService.getAllGenerateurFlux();
    }

    @GetMapping("/{id}")
    public GenerateurFlux getGenerateurFluxById(@PathVariable Long id) {
        return generateurFluxService.getGenerateurFluxById(id);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteGenerateurFlux(@PathVariable Long id) {
        generateurFluxService.deleteGenerateurFlux(id);
    }
    @PutMapping("/{id}")
    public GenerateurFlux updateGenerateur(@PathVariable Long id, @RequestBody GenerateurFlux generateurDetails) {
        return generateurFluxService.updateGenerateur(id, generateurDetails);
    }
    @GetMapping("/count")
    public long countAllGenerateurs() {
        return generateurFluxService.countAllGenerateurs();
    }
}
