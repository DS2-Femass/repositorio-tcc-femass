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
public class AlunoDTO {
    private UUID id;
    private String nomeCompleto;
    private String telefone;
    private String email;
    private String matricula;
    private UUID turmaId;
    private String turmaNome;

    public AlunoDTO(Aluno entity){
        BeanUtils.copyProperties(entity, this);
        if (entity.getTurma() != null) {
            this.turmaId = entity.getTurma().getId();
            this.turmaNome = entity.getTurma().getNome();
        }
    }
}
