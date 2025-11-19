package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Categoria;
import com.example.repositorioDeTcc.model.Curso;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class CursoDTO {

    private UUID id;
    private String nome;

    public CursoDTO(Curso entity) {
        BeanUtils.copyProperties(entity, this);
    }

}
