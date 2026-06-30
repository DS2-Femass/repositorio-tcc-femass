package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.TurmaCreateDTO;
import com.example.repositorioDeTcc.dto.TurmaDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.model.Turma;
import com.example.repositorioDeTcc.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TurmaService {

    @Autowired
    TurmaRepository repository;

    @Transactional(readOnly = true)
    public TurmaDTO findById(UUID id) {
        Optional<Turma> obj = repository.findById(id);
        return new TurmaDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
    }

    @Transactional(readOnly = true)
    public List<TurmaDTO> findAll() {
        return repository.findAll().stream()
                .map(TurmaDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public TurmaDTO insert(TurmaCreateDTO dto) {
        if (repository.existsByNome(dto.getNome())) {
            throw new RuntimeException("Turma com esse nome já existe");
        }
        Turma turma = new Turma(dto.getNome());
        return new TurmaDTO(repository.save(turma));
    }

    @Transactional
    public TurmaDTO update(UUID id, TurmaCreateDTO dto) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(id);
        Turma entity = repository.getReferenceById(id);
        entity.setNome(dto.getNome());
        return new TurmaDTO(repository.save(entity));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException(id);
        repository.deleteById(id);
    }
}
