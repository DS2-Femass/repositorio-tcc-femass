package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AlunoRepository extends JpaRepository<Aluno, UUID> {
    public List<Aluno> findAllByAtivoIsTrue();

    public Boolean existsByMatriculaOrEmail(String matricula, String email);
    public Optional<Aluno> findByMatricula(String matricula);
    public Optional<Aluno> findByEmail(String email);

    @Query("SELECT a FROM Aluno a JOIN a.turma t WHERE t.id = :turmaId")
    List<Aluno> findAllByTurmaId(@Param("turmaId") UUID turmaId);
}
