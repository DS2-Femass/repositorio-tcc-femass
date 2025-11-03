package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.PalavraChaveDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveCreateDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveUpdateDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.PalavraChaveMapper;
import com.example.repositorioDeTcc.model.PalavraChave;
import com.example.repositorioDeTcc.repository.PalavraChaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PalavraChaveService {
    
    @Autowired
    PalavraChaveRepository repository;

    @Autowired
    PalavraChaveMapper mapper;

    @Transactional(readOnly = true)
    public PalavraChaveDTO findById(UUID id) {
        Optional<PalavraChave> obj = repository.findById(id);
        PalavraChaveDTO dto = new PalavraChaveDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<PalavraChaveDTO> findAll() {
        List<PalavraChave> list = repository.findAll();
        List<PalavraChaveDTO> listDTO = list.stream()
            .map(palavra -> new PalavraChaveDTO(palavra))
            .collect(Collectors.toList());
        return listDTO;
    }

    @Transactional(readOnly = true)
    public List<PalavraChaveDTO> findAllActive() {
        List<PalavraChave> list = repository.findByAtivoTrue();
        List<PalavraChaveDTO> listDTO = list.stream()
            .map(palavra -> new PalavraChaveDTO(palavra))
            .collect(Collectors.toList());
        return listDTO;
    }

    @Transactional(readOnly = true)
    public List<PalavraChaveDTO> searchByNome(String searchTerm) {
        List<PalavraChave> list = repository.findActiveByNomeContainingIgnoreCase(searchTerm);
        List<PalavraChaveDTO> listDTO = list.stream()
            .map(palavra -> new PalavraChaveDTO(palavra))
            .collect(Collectors.toList());
        return listDTO;
    }

    public PalavraChaveDTO insert(PalavraChaveCreateDTO palavraChaveDTO) {
        if(palavraChaveDTO == null) throw new RequiredObjectIsNullException();
        
        // Check if keyword already exists
        Optional<PalavraChave> existing = repository.findByNome(palavraChaveDTO.getNome());
        if(existing.isPresent()) {
            throw new RuntimeException("Palavra-chave já cadastrada");
        }
        
        PalavraChave palavraChave = mapper.fromPalavraChaveCreateDTOToPalavraChave(palavraChaveDTO);
        return mapper.toPalavraChaveDTO(repository.save(palavraChave));
    }

    public void delete(UUID id) {
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);
        repository.deleteById(id);
    }

    @Transactional
    public PalavraChaveDTO update(UUID id, PalavraChaveUpdateDTO obj) {
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        PalavraChave entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return mapper.toPalavraChaveDTO(repository.save(entity));
    }

    private void updateData(PalavraChave entity, PalavraChaveUpdateDTO obj) {
        if(obj.getNome() != null && !obj.getNome().isEmpty()) {
            entity.setNome(obj.getNome());
        }
        if(obj.getAtivo() != null) {
            entity.setAtivo(obj.getAtivo());
        }
    }
}

