package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.Orientador;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrientadorRepository extends JpaRepository<Orientador, UUID> {
    public List<Orientador> findAllByAtivoIsTrue();
    public Optional<Orientador> findByCpf(String cpf);
}
