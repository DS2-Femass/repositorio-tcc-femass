package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "turma")
@Data
@NoArgsConstructor
public class Turma implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nome;

    public Turma(String nome) {
        this.nome = nome;
    }
}
