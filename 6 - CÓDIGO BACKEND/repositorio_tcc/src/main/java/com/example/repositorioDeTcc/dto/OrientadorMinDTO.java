package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.Orientador;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class OrientadorMinDTO {
    private UUID id;
    private String nomeCompleto;
    private String cpf;
    private String email;

    public OrientadorMinDTO(Orientador entity){
        BeanUtils.copyProperties(entity, this);
    }
}
