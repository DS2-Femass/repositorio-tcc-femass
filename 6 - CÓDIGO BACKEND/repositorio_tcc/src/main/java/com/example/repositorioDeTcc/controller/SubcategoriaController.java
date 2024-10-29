package com.example.repositorioDeTcc.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.repositorioDeTcc.dto.SubcategoriaDTO;
import com.example.repositorioDeTcc.service.SubcategoriaService;

@RestController
@RequestMapping(value = "/subcategorias")
@CrossOrigin
public class SubcategoriaController {

     @Autowired
    SubcategoriaService service;
  

    @GetMapping(value = "/{id}")
    public ResponseEntity<SubcategoriaDTO> findById(@PathVariable UUID id) {
        SubcategoriaDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<SubcategoriaDTO>> findAll() {
        List<SubcategoriaDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SubcategoriaDTO> create(@RequestBody SubcategoriaDTO subcategoria){

        subcategoria = service.insert(subcategoria);
        return ResponseEntity.ok().body(subcategoria);
    }

    @PutMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
        public ResponseEntity<SubcategoriaDTO> update(@PathVariable UUID id, @RequestBody SubcategoriaDTO subcategoria){

        subcategoria = service.update(id, subcategoria);
        return ResponseEntity.ok().body(subcategoria);
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){

        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    
}
