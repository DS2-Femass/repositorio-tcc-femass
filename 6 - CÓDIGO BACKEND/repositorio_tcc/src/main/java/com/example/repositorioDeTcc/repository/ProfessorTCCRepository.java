package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.ProfessorTCC;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProfessorTCCRepository extends JpaRepository<ProfessorTCC, UUID> {
}
