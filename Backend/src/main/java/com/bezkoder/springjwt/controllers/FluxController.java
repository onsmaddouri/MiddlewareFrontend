package com.bezkoder.springjwt.controllers;

import com.bezkoder.springjwt.models.Flux;
import com.bezkoder.springjwt.service.FluxServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/flux")
@CrossOrigin(origins = "http://localhost:4200")
public class FluxController {

    @Autowired
    private FluxServiceImpl fluxService;


    @GetMapping("/all")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public List<Flux> getAll() {
        return fluxService.getAllFlux(); // problème possible ici
    }

    @PostMapping("/addflux")
    @PreAuthorize("hasRole('ADMIN')")
    public Flux createFlux(@RequestBody Flux flux) {
        return fluxService.saveFlux(flux);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public Flux getFluxById(@PathVariable Long id) {
        return fluxService.getFluxById(id);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Flux updateFlux(@PathVariable Long id, @RequestBody Flux fluxDetails) {
        return fluxService.updateFlux(id, fluxDetails);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteFlux(@PathVariable Long id) {
        fluxService.deleteFlux(id);
    }

    @PutMapping("/{id}/archive")
    @PreAuthorize("hasRole('ADMIN')")
    public void archiveFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.archiveFlux(id, adminName);
    }

    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public void validateFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.validateFlux(id, adminName);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN')")
    public void cancelFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.cancelFlux(id, adminName);
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasRole('ADMIN')")
    public void startFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.startFlux(id, adminName);
    }
    @PutMapping("/{id}/unarchive")
    @PreAuthorize("hasRole('ADMIN')")
    public void unarchiveFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.unarchiveFlux(id, adminName);
    }

    @PutMapping("/{id}/unvalidate")
    @PreAuthorize("hasRole('ADMIN')")
    public void unvalidateFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.unvalidateFlux(id, adminName);
    }

    @PutMapping("/{id}/uncancel")
    @PreAuthorize("hasRole('ADMIN')")
    public void uncancelFlux(@PathVariable Long id, @RequestParam String adminName) {
        fluxService.uncancelFlux(id, adminName);
    }
    @GetMapping("/count")
    public long countAllFlux() {
        return fluxService.countAllFlux();
    }
}
