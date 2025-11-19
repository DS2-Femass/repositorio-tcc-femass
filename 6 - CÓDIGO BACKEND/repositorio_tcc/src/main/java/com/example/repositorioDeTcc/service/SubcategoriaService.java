package com.example.repositorioDeTcc.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.repositorioDeTcc.dto.SubcategoriaDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.SubcategoriaMapper;
import com.example.repositorioDeTcc.model.Subcategoria;
import com.example.repositorioDeTcc.repository.CategoriaRepository;
import com.example.repositorioDeTcc.repository.SubcategoriaRepository;

@Service
public class SubcategoriaService {
    
    @Autowired
    SubcategoriaRepository repository;

    @Autowired
    SubcategoriaMapper subcategoriaMapper;

    @Autowired
    CategoriaRepository categoriaRepository;

    @Transactional(readOnly = true)
    public SubcategoriaDTO findById(UUID id){
        Optional<Subcategoria> obj = repository.findById(id);
        SubcategoriaDTO dto = new SubcategoriaDTO(obj.orElseThrow(()-> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional (readOnly = true)
    public List<SubcategoriaDTO> findAll(UUID idCategoria){
        //Se o parâmetro de idCategoria foi passado pelo usuário, busque com base nele. Se não, busque todos.
        List<Subcategoria> list = (idCategoria == null) ? repository.findAll() : repository.findAllByCategoriaId(idCategoria);

        List<SubcategoriaDTO> listDTO = list.stream().map(subcategoria-> new SubcategoriaDTO(subcategoria)).toList();
        return listDTO;
    }

    public SubcategoriaDTO insert(SubcategoriaDTO subcategoriaDTO){
        if(subcategoriaDTO == null) throw new RequiredObjectIsNullException();
        Subcategoria subcategoria = subcategoriaMapper.fromSubcategoriaDTOToSubcategoria(subcategoriaDTO);
        return subcategoriaMapper.toSubcategoriaDTO(repository.save(subcategoria));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);
        repository.deleteById(id);
    }

    @Transactional
    public  SubcategoriaDTO update (UUID id, SubcategoriaDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        Subcategoria entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return subcategoriaMapper.toSubcategoriaDTO(repository.save(entity));

    }
    private void updateData(Subcategoria entity, SubcategoriaDTO obj) {
        entity.setNomeSubcategoria(obj.getNomeSubcategoria());
        entity.setDescricaoSubcategoria(obj.getDescricaoSubcategoria());
        entity.setCategoria(categoriaRepository.findById(obj.getIdCategoria()).orElseThrow(() -> new ResourceNotFoundException(obj.getIdCategoria())));
    }
}

