package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.CursoDTO;
import com.example.repositorioDeTcc.model.Curso;
import com.example.repositorioDeTcc.repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CursoService {
    
    @Autowired
    CursoRepository repository;

    @Transactional (readOnly = true)
    public List<CursoDTO> findAll(){
        List<Curso> list = repository.findAll();
        List<CursoDTO> listDTO = list.stream().map(curso-> new CursoDTO(curso)).toList();
        return listDTO;
    }

}
