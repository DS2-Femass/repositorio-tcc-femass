package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Categoria;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

import org.springframework.beans.BeanUtils;

@NoArgsConstructor
@Getter
@Setter
public class CategoriaDTO {

    private UUID id;
    private String nomeCategoria;
    private String descricaoCategoria;

    public CategoriaDTO(Categoria entity) {
        BeanUtils.copyProperties(entity, this);
    }

}
