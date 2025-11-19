package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Aluno;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class AlunoMinDTO {
    private UUID id;
    private String nomeCompleto;
    private String matricula;

    public AlunoMinDTO(Aluno entity){
        BeanUtils.copyProperties(entity, this);
    }
}
