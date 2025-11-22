package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.PalavraChave;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class PalavraChaveDTO {
    
    private UUID id;
    private String nome;
    private Boolean ativo;
    
    public PalavraChaveDTO(PalavraChave entity) {
        BeanUtils.copyProperties(entity, this);
    }
}

