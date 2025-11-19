package com.example.repositorioDeTcc.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Table(name = "professor_tcc")
@Entity
public class ProfessorTCC extends Pessoa{

    private String cpf;

    public ProfessorTCC(String nomeCompleto, String telefone, String email, String cpf) {
        super(nomeCompleto, telefone, email);
        this.cpf = cpf;
    }
}
