package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.OrientadorDTO;
import com.example.repositorioDeTcc.dto.OrientadorMinDTO;
import com.example.repositorioDeTcc.service.OrientadorService;
import com.example.repositorioDeTcc.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/orientadores")
@CrossOrigin
public class OrientadorController {

    @Autowired
    OrientadorService service;
    @Autowired
    TokenService tokenService;

    @GetMapping(value = "/{id}")
    public ResponseEntity<OrientadorDTO> findById(@PathVariable UUID id){
        OrientadorDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<OrientadorMinDTO>> findAll(){
        List<OrientadorMinDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrientadorDTO> create(@RequestBody OrientadorDTO orientador){

        orientador = service.insert(orientador);
        return ResponseEntity.ok().body(orientador);
    }

    @PutMapping(value = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OrientadorDTO> update(@PathVariable UUID id, @RequestBody OrientadorDTO orientador){

        orientador = service.update(id, orientador);
        return ResponseEntity.ok().body(orientador);

    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){
        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
