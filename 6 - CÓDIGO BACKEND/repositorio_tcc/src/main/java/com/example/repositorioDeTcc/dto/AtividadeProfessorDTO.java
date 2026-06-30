package com.example.repositorioDeTcc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AtividadeProfessorDTO {

    private UUID idAtividade;
    private String descricao;
    private LocalDate dataEntrega;
    private UUID idAluno;
    private String nomeAluno;
    private UUID idEntrega;
    private LocalDate dataRealizacao;
    private BigDecimal nota;
    private String arquivoNome;
}
