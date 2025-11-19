package com.example.repositorioDeTcc.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.repositorioDeTcc.dto.CategoriaDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.CategoriaMapper;
import com.example.repositorioDeTcc.model.Categoria;
import com.example.repositorioDeTcc.repository.CategoriaRepository;

@Service
public class CategoriaService {
    
    @Autowired
    CategoriaRepository repository;

    @Autowired
    CategoriaMapper categoriaMapper;

    @Transactional(readOnly = true)
    public CategoriaDTO findById(UUID id){
        Optional<Categoria> obj = repository.findById(id);
        CategoriaDTO dto = new CategoriaDTO(obj.orElseThrow(()-> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional (readOnly = true)
    public List<CategoriaDTO> findAll(){
        List<Categoria> list = repository.findAll();
        List<CategoriaDTO> listDTO = list.stream().map(categoria-> new CategoriaDTO(categoria)).toList();
        return listDTO;
    }

    public CategoriaDTO insert(CategoriaDTO categoriaDTO){
        if(categoriaDTO == null) throw new RequiredObjectIsNullException();
        Categoria categoria = categoriaMapper.fromCategoriaDTOToCategoria(categoriaDTO);
        return categoriaMapper.toCategoriaDTO(repository.save(categoria));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);
        repository.deleteById(id);
    }

    @Transactional
    public  CategoriaDTO update (UUID id, CategoriaDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        Categoria entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return categoriaMapper.toCategoriaDTO(repository.save(entity));

    }
    private void updateData(Categoria entity, CategoriaDTO obj){
        entity.setNomeCategoria(obj.getNomeCategoria());
        entity.setDescricaoCategoria(obj.getDescricaoCategoria());
    }

}
