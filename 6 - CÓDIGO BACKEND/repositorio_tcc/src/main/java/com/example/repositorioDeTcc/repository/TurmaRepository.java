package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Turma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TurmaRepository extends JpaRepository<Turma, UUID> {

    boolean existsByNome(String nome);
}
