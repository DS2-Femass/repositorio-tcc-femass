package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.PalavraChaveCreateDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveDTO;
import com.example.repositorioDeTcc.dto.PalavraChaveUpdateDTO;
import com.example.repositorioDeTcc.model.PalavraChave;
import com.example.repositorioDeTcc.repository.PalavraChaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PalavraChaveMapper {
    
    @Autowired
    private PalavraChaveRepository palavraChaveRepository;

    public PalavraChave fromPalavraChaveCreateDTOToPalavraChave(PalavraChaveCreateDTO dto) {
        return new PalavraChave(dto.getNome(), dto.getAtivo());
    }

    public PalavraChave fromPalavraChaveUpdateDTOToPalavraChave(PalavraChaveUpdateDTO dto) {
        return new PalavraChave(dto.getNome(), dto.getAtivo());
    }

    public PalavraChaveDTO toPalavraChaveDTO(PalavraChave palavraChave) {
        return new PalavraChaveDTO(palavraChave);
    }
}

