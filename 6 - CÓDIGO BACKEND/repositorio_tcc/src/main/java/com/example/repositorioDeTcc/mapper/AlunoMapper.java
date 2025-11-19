package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.model.Aluno;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    @Autowired
    private ModelMapper mapper;

    public Aluno fromAlunoDTOToAluno(AlunoDTO alunoDTO){
        return new Aluno(alunoDTO.getNomeCompleto(), alunoDTO.getTelefone(), alunoDTO.getEmail(), alunoDTO.getMatricula());
    }

    public AlunoDTO toAlunoDTO(Aluno aluno){
        return new AlunoDTO(aluno);
    }
}
