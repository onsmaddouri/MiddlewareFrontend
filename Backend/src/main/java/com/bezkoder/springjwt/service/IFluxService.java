package com.bezkoder.springjwt.service;

import com.bezkoder.springjwt.models.Flux;
import java.util.List;

public interface IFluxService {
    Flux saveFlux(Flux flux);
    List<Flux> getAllFlux();
    Flux getFluxById(Long id);
    void deleteFlux(Long id);
}
