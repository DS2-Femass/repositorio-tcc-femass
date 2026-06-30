package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "atividade")
@Data
@NoArgsConstructor
public class Atividade implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "data_entrega", nullable = false)
    private LocalDate dataEntrega;

    @ManyToOne(optional = false)
    @JoinColumn(name = "turma_id", referencedColumnName = "id", nullable = false)
    private Turma turma;

    public Atividade(String descricao, LocalDate dataEntrega, Turma turma) {
        this.descricao = descricao;
        this.dataEntrega = dataEntrega;
        this.turma = turma;
    }
}
