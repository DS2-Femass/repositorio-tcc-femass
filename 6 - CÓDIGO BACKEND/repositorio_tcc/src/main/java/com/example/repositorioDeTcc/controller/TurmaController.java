package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.TurmaCreateDTO;
import com.example.repositorioDeTcc.dto.TurmaDTO;
import com.example.repositorioDeTcc.service.TurmaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/turmas")
@CrossOrigin
public class TurmaController {

    @Autowired
    TurmaService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<TurmaDTO> findById(@PathVariable UUID id) {
        TurmaDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<TurmaDTO>> findAll() {
        List<TurmaDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TurmaDTO> create(@Valid @RequestBody TurmaCreateDTO dto) {
        TurmaDTO result = service.insert(dto);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TurmaDTO> update(@PathVariable UUID id, @Valid @RequestBody TurmaCreateDTO dto) {
        TurmaDTO result = service.update(id, dto);
        return ResponseEntity.ok().body(result);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
