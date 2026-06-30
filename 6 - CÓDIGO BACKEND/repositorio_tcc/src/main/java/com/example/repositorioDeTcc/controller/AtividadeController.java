package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.*;
import com.example.repositorioDeTcc.service.AtividadeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/atividades")
@CrossOrigin
public class AtividadeController {

    @Autowired
    AtividadeService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<AtividadeDTO> findById(@PathVariable UUID id) {
        AtividadeDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<AtividadeDTO>> findAll() {
        List<AtividadeDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    /**
     * View do professor: tabela flat de todos alunos × atividades de uma turma.
     */
    @GetMapping(value = "/turma/{turmaId}")
    public ResponseEntity<List<AtividadeProfessorDTO>> findByTurma(@PathVariable UUID turmaId) {
        List<AtividadeProfessorDTO> result = service.findAllForProfessor(turmaId);
        return ResponseEntity.ok().body(result);
    }

    /**
     * View do aluno: apenas suas próprias atividades.
     */
    @GetMapping(value = "/my", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<EntregaAtividadeDTO>> findMine(Principal connectedUser) {
        List<EntregaAtividadeDTO> result = service.findMine(connectedUser);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AtividadeDTO> create(@Valid @RequestBody AtividadeCreateDTO dto) {
        AtividadeDTO result = service.insert(dto);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AtividadeDTO> update(@PathVariable UUID id, @RequestBody AtividadeUpdateDTO dto) {
        AtividadeDTO result = service.update(id, dto);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
