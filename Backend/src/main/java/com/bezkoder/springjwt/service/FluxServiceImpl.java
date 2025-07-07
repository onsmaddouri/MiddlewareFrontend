package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Flux;
import com.bezkoder.springjwt.models.StatutFlux;
import com.bezkoder.springjwt.repository.FluxRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FluxServiceImpl implements IFluxService {

    @Autowired
    private FluxRepository fluxRepository;

    @Override
    public Flux saveFlux(Flux flux) {
        return fluxRepository.save(flux);
    }

    @Override
    public List<Flux> getAllFlux() {
        return fluxRepository.findAll();
    }

    @Override
    public Flux getFluxById(Long id) {
        return fluxRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteFlux(Long id) {
        fluxRepository.deleteById(id);
    }

    public void archiveFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setArchived(true);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }

    public void validateFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setValidated(true);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName); // Enregistrer l'administrateur qui fait l'action
            fluxRepository.save(flux);
        }
    }

    public void cancelFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setCancelled(true);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }

    public void startFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null && flux.isValidated()) {
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }
    public void unarchiveFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setArchived(false);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }

    public void unvalidateFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setValidated(false);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }

    public void uncancelFlux(Long id, String adminName) {
        Flux flux = fluxRepository.findById(id).orElse(null);
        if (flux != null) {
            flux.setCancelled(false);
            flux.setStatut(calculerStatut(flux.isArchived(), flux.isValidated(), flux.isCancelled()));
            flux.setModifiedBy(adminName);
            fluxRepository.save(flux);
        }
    }
    private StatutFlux calculerStatut(boolean archived, boolean validated, boolean cancelled) {
        if (archived && validated && cancelled) return StatutFlux.ECHEC;
        if (archived && cancelled) return StatutFlux.ECHEC;
        if (validated && cancelled) return StatutFlux.ECHEC;
        if (archived && validated) return StatutFlux.TERMINE;
        if (archived) return StatutFlux.ARCHIVE;
        if (cancelled) return StatutFlux.ECHEC;
        if (validated) return StatutFlux.EN_COURS;
        return StatutFlux.EN_ATTENTE;
    }
    public Flux updateFlux(Long id, Flux fluxDetails) {
        Flux flux = getFluxById(id);
        if (flux != null) {
            flux.setNomFlux(fluxDetails.getNomFlux());
            flux.setTypeFlux(fluxDetails.getTypeFlux());
            flux.setDateCreation(fluxDetails.getDateCreation());
            flux.setArchived(fluxDetails.isArchived());
            flux.setValidated(fluxDetails.isValidated());
            flux.setCancelled(fluxDetails.isCancelled());
            flux.setModifiedBy(fluxDetails.getModifiedBy());
            flux.setConnecteur(fluxDetails.getConnecteur());
            flux.setGenerateurFlux(fluxDetails.getGenerateurFlux());
            flux.setServiceEntities(fluxDetails.getServiceEntities());
            flux.setStatut(calculerStatut(
                    flux.isArchived(),
                    flux.isValidated(),
                    flux.isCancelled()
            ));
            return saveFlux(flux);
        } else {
            throw new RuntimeException("Flux not found with id " + id);
        }
    }
    public long countAllFlux() {
        return fluxRepository.count();
    }
}
