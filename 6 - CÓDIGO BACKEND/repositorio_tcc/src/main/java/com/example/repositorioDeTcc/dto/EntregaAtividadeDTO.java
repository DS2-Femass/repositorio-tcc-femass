package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.EntregaAtividade;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
public class EntregaAtividadeDTO {

    private UUID id;
    private UUID idAtividade;
    private String descricaoAtividade;
    private LocalDate dataEntrega;
    private UUID idAluno;
    private String nomeAluno;
    private LocalDate dataRealizacao;
    private BigDecimal nota;
    private String arquivoNome;

    public EntregaAtividadeDTO(EntregaAtividade entrega) {
        this.id = entrega.getId();
        this.idAtividade = entrega.getAtividade().getId();
        this.descricaoAtividade = entrega.getAtividade().getDescricao();
        this.dataEntrega = entrega.getAtividade().getDataEntrega();
        this.idAluno = entrega.getAluno().getId();
        this.nomeAluno = entrega.getAluno().getNomeCompleto();
        this.dataRealizacao = entrega.getDataRealizacao();
        this.nota = entrega.getNota();
        this.arquivoNome = entrega.getArquivoNome();
    }
}
