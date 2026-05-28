package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "entrega_atividade")
@Data
@NoArgsConstructor
public class EntregaAtividade implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "atividade_id", referencedColumnName = "id", nullable = false)
    private Atividade atividade;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @Column(name = "data_realizacao")
    private LocalDate dataRealizacao;

    @Column(precision = 4, scale = 1)
    private BigDecimal nota;

    @Column(name = "arquivo_nome", length = 255)
    private String arquivoNome;

    @Column(name = "arquivo_caminho", length = 500)
    private String arquivoCaminho;

    public EntregaAtividade(Atividade atividade, Aluno aluno) {
        this.atividade = atividade;
        this.aluno = aluno;
    }
}
