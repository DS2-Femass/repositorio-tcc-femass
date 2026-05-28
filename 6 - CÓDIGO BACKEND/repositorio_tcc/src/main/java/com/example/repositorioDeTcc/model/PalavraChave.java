package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "palavra_chave")
@Data
@NoArgsConstructor
public class PalavraChave implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false, unique = true, length = 30)
    private String nome;

    @Column(nullable = false)
    private Boolean ativo;

    public PalavraChave(String nome, Boolean ativo) {
        this.nome = nome;
        this.ativo = ativo != null ? ativo : true;
    }

    public PalavraChave(String nome) {
        this.nome = nome;
        this.ativo = true;
    }
}

