package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.EntregaAtividade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EntregaAtividadeRepository extends JpaRepository<EntregaAtividade, UUID> {

    Optional<EntregaAtividade> findByAtividadeIdAndAlunoId(UUID atividadeId, UUID alunoId);

    List<EntregaAtividade> findAllByAlunoId(UUID alunoId);

    @Query("SELECT e FROM EntregaAtividade e WHERE e.atividade.turma.id = :turmaId")
    List<EntregaAtividade> findAllByTurmaId(@Param("turmaId") UUID turmaId);
}
