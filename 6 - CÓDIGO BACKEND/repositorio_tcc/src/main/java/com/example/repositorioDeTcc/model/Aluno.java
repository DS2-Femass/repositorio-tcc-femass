package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table
public class Aluno extends Pessoa{

    private String matricula;

    @ManyToOne
    @JoinColumn(name = "turma_id", referencedColumnName = "id")
    private Turma turma;

    public Aluno(String nomeCompleto, String telefone, String email, String matricula){
        super(nomeCompleto, telefone, email);
        this.matricula = matricula;
    }

}
