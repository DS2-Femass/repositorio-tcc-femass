package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.UserDTO;
import com.example.repositorioDeTcc.dto.UserForListDTO;
import com.example.repositorioDeTcc.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/users")
@CrossOrigin
public class UserController {

    @Autowired
    UserService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<UserForListDTO> findById(@PathVariable UUID id){
        UserForListDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }
    
    @GetMapping
    public ResponseEntity<List<UserForListDTO>> findAll(){
        List<UserForListDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @PutMapping(value = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDTO> update(@PathVariable UUID id, @RequestBody UserDTO user){

        user = service.update(id, user);
        return ResponseEntity.ok().body(user);

    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

}
