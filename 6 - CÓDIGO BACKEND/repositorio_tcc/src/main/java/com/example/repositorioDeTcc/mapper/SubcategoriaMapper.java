package com.example.repositorioDeTcc.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.repositorioDeTcc.dto.SubcategoriaDTO;
import com.example.repositorioDeTcc.model.Subcategoria;
import com.example.repositorioDeTcc.repository.CategoriaRepository;

@Component
public class SubcategoriaMapper {

      @Autowired
    private ModelMapper mapper;
     @Autowired
    private CategoriaRepository categoriaRepository;

    public Subcategoria fromSubcategoriaDTOToSubcategoria(SubcategoriaDTO subcategoriaDTO){
        return new Subcategoria(subcategoriaDTO.getNomeSubcategoria(),subcategoriaDTO.getDescricaoSubcategoria(),categoriaRepository.findById(subcategoriaDTO.getIdCategoria()).get());
    }

    public SubcategoriaDTO toSubcategoriaDTO(Subcategoria subcategoria){
        return new SubcategoriaDTO(subcategoria);
    }
    
}
