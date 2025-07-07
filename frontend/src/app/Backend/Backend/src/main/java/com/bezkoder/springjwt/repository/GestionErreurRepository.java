package com.bezkoder.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.bezkoder.springjwt.models.GestionErreur;

@Repository
public interface GestionErreurRepository extends JpaRepository<GestionErreur, Long> {
}
