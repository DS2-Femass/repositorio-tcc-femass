package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TurmaCreateDTO {

    @NotBlank(message = "Nome da turma é obrigatório")
    private String nome;

    public TurmaCreateDTO(String nome) {
        this.nome = nome;
    }
}
