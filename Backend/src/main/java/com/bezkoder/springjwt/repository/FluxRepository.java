package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bezkoder.springjwt.models.Flux;

@Repository
public interface FluxRepository extends JpaRepository<Flux, Long> {
}
