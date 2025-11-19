package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Subcategoria;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class SubcategoriaDTO {

    private UUID id;
    private String nomeSubcategoria;
    private String descricaoSubcategoria;
    private UUID idCategoria;

    public SubcategoriaDTO(Subcategoria entity) {
        this.id = entity.getId();
        this.nomeSubcategoria = entity.getNomeSubcategoria();
        this.descricaoSubcategoria = entity.getDescricaoSubcategoria();
        this.idCategoria = entity.getCategoria().getId();
    }

}
