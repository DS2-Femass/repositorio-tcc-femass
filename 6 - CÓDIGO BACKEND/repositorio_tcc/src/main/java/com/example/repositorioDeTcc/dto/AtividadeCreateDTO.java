package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class AtividadeCreateDTO {

    @NotBlank(message = "Descrição da atividade é obrigatória")
    private String descricao;

    @NotNull(message = "Data de entrega é obrigatória")
    private LocalDate dataEntrega;

    @NotNull(message = "Turma é obrigatória")
    private UUID idTurma;

    public AtividadeCreateDTO(String descricao, LocalDate dataEntrega, UUID idTurma) {
        this.descricao = descricao;
        this.dataEntrega = dataEntrega;
        this.idTurma = idTurma;
    }
}
