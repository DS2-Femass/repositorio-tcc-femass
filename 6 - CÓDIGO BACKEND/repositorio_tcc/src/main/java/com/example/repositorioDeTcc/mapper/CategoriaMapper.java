package com.example.repositorioDeTcc.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.repositorioDeTcc.dto.CategoriaDTO;
import com.example.repositorioDeTcc.model.Categoria;

@Component
public class CategoriaMapper {
    @Autowired
    private ModelMapper mapper;

    public Categoria fromCategoriaDTOToCategoria(CategoriaDTO categoriaDTO){
        return new Categoria(categoriaDTO.getNomeCategoria(), categoriaDTO.getDescricaoCategoria());
    }

    public CategoriaDTO toCategoriaDTO(Categoria categoria){
        return new CategoriaDTO(categoria);
    }
}
