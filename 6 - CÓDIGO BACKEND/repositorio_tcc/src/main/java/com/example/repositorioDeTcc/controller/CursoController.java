package com.example.repositorioDeTcc.controller;
import com.example.repositorioDeTcc.dto.CursoDTO;
import com.example.repositorioDeTcc.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(value = "/cursos")
@CrossOrigin
public class CursoController {

    @Autowired
    CursoService service;

    @GetMapping
    public ResponseEntity<List<CursoDTO>> findAll() {
        List<CursoDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

}
