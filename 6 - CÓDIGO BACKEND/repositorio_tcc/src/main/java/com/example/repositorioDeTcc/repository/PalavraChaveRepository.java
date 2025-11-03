package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.PalavraChave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PalavraChaveRepository extends JpaRepository<PalavraChave, UUID> {
    
    Optional<PalavraChave> findByNome(String nome);
    
    List<PalavraChave> findByAtivoTrue();
    
    @Query("SELECT p FROM PalavraChave p WHERE p.ativo = true AND LOWER(p.nome) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<PalavraChave> findActiveByNomeContainingIgnoreCase(@Param("searchTerm") String searchTerm);
}

