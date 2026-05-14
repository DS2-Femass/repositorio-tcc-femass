package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class PalavraChaveCreateDTO {
    
    @NotBlank(message = "Nome da palavra-chave é obrigatório")
    @Size(max = 30, message = "Nome deve ter no máximo 30 caracteres")
    private String nome;
    
    private Boolean ativo;
    
    public PalavraChaveCreateDTO(String nome, Boolean ativo) {
        this.nome = nome;
        this.ativo = ativo;
    }
}

