package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Turma;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class TurmaDTO {

    private UUID id;
    private String nome;

    public TurmaDTO(Turma turma) {
        this.id = turma.getId();
        this.nome = turma.getNome();
    }
}
