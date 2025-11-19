package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Categoria;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, UUID>{
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Categoria i WHERE LOWER(i.nomeCategoria) = LOWER(:nome)")
    boolean existsByNomeIgnoreCase(@Param("nome") String nome);
    
} 
