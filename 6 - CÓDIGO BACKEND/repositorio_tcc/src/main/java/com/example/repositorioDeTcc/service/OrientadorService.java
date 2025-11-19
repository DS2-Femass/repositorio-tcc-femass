package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.OrientadorDTO;
import com.example.repositorioDeTcc.dto.OrientadorMinDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.OrientadorMapper;
import com.example.repositorioDeTcc.model.Orientador;
import com.example.repositorioDeTcc.repository.OrientadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

@Service
public class OrientadorService {

    @Autowired
    OrientadorRepository repository;

    @Autowired
    OrientadorMapper orientadorMapper;

    @Transactional(readOnly = true)
    public OrientadorDTO findById(UUID id){
        Optional<Orientador> obj = repository.findById(id);
        OrientadorDTO dto = new OrientadorDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<OrientadorMinDTO> findAll(){
        List <Orientador> list = repository.findAllByAtivoIsTrue();
        List<OrientadorMinDTO> listDto = list.stream().map(orientador -> new OrientadorMinDTO(orientador)).toList();
        return listDto;
    }

    public OrientadorDTO insert(OrientadorDTO orientadorDTO){

        if(orientadorDTO == null) throw new RequiredObjectIsNullException();

        Orientador orientador = orientadorMapper.fromOrientadorDTOToOrientador(orientadorDTO);
        return orientadorMapper.toOrientadorDTO(repository.save(orientador));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        repository.deleteById(id);
    }

    @Transactional
    public OrientadorDTO update(UUID id, OrientadorDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        Orientador entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return orientadorMapper.toOrientadorDTO(repository.save(entity));
    }

    private void updateData(Orientador entity, OrientadorDTO obj) {
        entity.setNomeCompleto(obj.getNomeCompleto());
        entity.setEmail(obj.getEmail());
        entity.setTelefone(obj.getTelefone());
    }
}
