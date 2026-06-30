package com.example.repositorioDeTcc.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class AtividadeUpdateDTO {

    private String descricao;
    private LocalDate dataEntrega;

    public AtividadeUpdateDTO(String descricao, LocalDate dataEntrega) {
        this.descricao = descricao;
        this.dataEntrega = dataEntrega;
    }
}
