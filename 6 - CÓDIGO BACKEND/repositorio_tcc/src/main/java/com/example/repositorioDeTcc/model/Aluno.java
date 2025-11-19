package com.example.repositorioDeTcc.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table
public class Aluno extends Pessoa{

    private String matricula;

    public Aluno(String nomeCompleto, String telefone, String email, String matricula){
        super(nomeCompleto, telefone, email);
        this.matricula = matricula;
    }

}
