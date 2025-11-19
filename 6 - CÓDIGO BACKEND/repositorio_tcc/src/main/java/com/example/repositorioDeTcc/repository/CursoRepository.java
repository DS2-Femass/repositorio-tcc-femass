package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface CursoRepository extends JpaRepository<Curso, UUID>{
    Boolean existsByNome(String nome);
} 
