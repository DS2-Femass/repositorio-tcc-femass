package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class PalavraChaveUpdateDTO {
    
    @Size(max = 30, message = "Nome deve ter no máximo 30 caracteres")
    private String nome;
    
    private Boolean ativo;
    
    public PalavraChaveUpdateDTO(String nome, Boolean ativo) {
        this.nome = nome;
        this.ativo = ativo;
    }
}

