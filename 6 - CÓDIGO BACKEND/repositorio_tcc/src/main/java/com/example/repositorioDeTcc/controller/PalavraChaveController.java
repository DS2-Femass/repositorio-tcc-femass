package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.PalavraChaveCreateDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveUpdateDTO;
import com.example.repositorioDeTcc.service.PalavraChaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/palavras-chave")
@CrossOrigin
public class PalavraChaveController {

    @Autowired
    PalavraChaveService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<PalavraChaveDTO> findById(@PathVariable UUID id) {
        PalavraChaveDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<PalavraChaveDTO>> findAll() {
        List<PalavraChaveDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping(value = "/ativas")
    public ResponseEntity<List<PalavraChaveDTO>> findAllActive() {
        List<PalavraChaveDTO> result = service.findAllActive();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping(value = "/pesquisa")
    public ResponseEntity<List<PalavraChaveDTO>> searchByNome(@RequestParam String termo) {
        List<PalavraChaveDTO> result = service.searchByNome(termo);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PalavraChaveDTO> create(@RequestBody PalavraChaveCreateDTO palavraChave) {
        PalavraChaveDTO result = service.insert(palavraChave);
        return ResponseEntity.ok().body(result);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PalavraChaveDTO> update(@PathVariable UUID id, @RequestBody PalavraChaveUpdateDTO palavraChave) {
        PalavraChaveDTO updatePalavraChave = service.update(id, palavraChave);
        return ResponseEntity.ok().body(updatePalavraChave);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}

