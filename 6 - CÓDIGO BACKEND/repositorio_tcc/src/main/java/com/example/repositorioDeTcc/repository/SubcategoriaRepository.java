package com.example.repositorioDeTcc.repository;

import java.util.List;
import java.util.UUID;

import com.example.repositorioDeTcc.model.Subcategoria;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoriaRepository extends JpaRepository<Subcategoria, UUID>{
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Subcategoria i WHERE LOWER(i.nomeSubcategoria) = LOWER(:nome)")
    boolean existsByNomeIgnoreCase(@Param("nome") String nome);

    @Query("SELECT s FROM Subcategoria s WHERE s.categoria.id = :id")
    List<Subcategoria> findAllByCategoriaId(@Param("id") UUID id);
}
