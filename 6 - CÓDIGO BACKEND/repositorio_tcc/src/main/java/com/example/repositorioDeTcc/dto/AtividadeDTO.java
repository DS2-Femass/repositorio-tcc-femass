package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Atividade;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class AtividadeDTO {

    private UUID id;
    private String descricao;
    private LocalDate dataEntrega;
    private UUID idTurma;
    private String nomeTurma;

    public AtividadeDTO(Atividade atividade) {
        this.id = atividade.getId();
        this.descricao = atividade.getDescricao();
        this.dataEntrega = atividade.getDataEntrega();
        this.idTurma = atividade.getTurma().getId();
        this.nomeTurma = atividade.getTurma().getNome();
    }
}
