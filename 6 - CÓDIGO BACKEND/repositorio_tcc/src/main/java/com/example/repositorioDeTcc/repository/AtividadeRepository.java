package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Atividade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AtividadeRepository extends JpaRepository<Atividade, UUID> {

    List<Atividade> findAllByTurmaId(UUID turmaId);
}
