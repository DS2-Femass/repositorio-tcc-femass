package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.OrientadorDTO;
import com.example.repositorioDeTcc.model.Orientador;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrientadorMapper {

    @Autowired
    private ModelMapper mapper;

    public Orientador fromOrientadorDTOToOrientador(OrientadorDTO orientadorDTO){
        return new Orientador(orientadorDTO.getNomeCompleto(), orientadorDTO.getTelefone(), orientadorDTO.getEmail(), orientadorDTO.getCpf());
    }

    public OrientadorDTO toOrientadorDTO(Orientador orientador){
        return new OrientadorDTO(orientador);
    }
}
