package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.TCCDTO;
import com.example.repositorioDeTcc.dto.TCCMinDTO;
import com.example.repositorioDeTcc.dto.TCCUpdateDTO;
import com.example.repositorioDeTcc.service.TCCService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/tcc")
@CrossOrigin
public class TCCController {

    @Autowired
    TCCService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<TCCDTO> findById(@PathVariable UUID id){
        TCCDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<TCCMinDTO>> findAll(){
        List<TCCMinDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping(value = "/my" , produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TCCDTO> findMine(Principal connectedUser){
        TCCDTO result = service.findMine(connectedUser);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TCCDTO> create(@RequestBody TCCDTO tcc){

        tcc = service.insert(tcc);
        return ResponseEntity.ok().body(tcc);
    }

    @PutMapping(value = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TCCDTO> update(@PathVariable UUID id, @RequestBody TCCUpdateDTO tcc){

        TCCDTO updateTcc = service.update(id, tcc);
        return ResponseEntity.ok().body(updateTcc);

    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){
        service.delete(id);

        return ResponseEntity.noContent().build();
    }
}
