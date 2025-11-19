package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.TCCDTO;
import com.example.repositorioDeTcc.model.*;
import com.example.repositorioDeTcc.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class TCCMapper {

    @Autowired
    private ModelMapper mapper;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private OrientadorRepository orientadorRepository;

    @Autowired
    private SubcategoriaRepository subcategoriaRepository;

    @Autowired
    private CursoRepository cursoRepository;

    public TCC fromTCCDTOToTCC(TCCDTO dto) {

        Optional<Aluno> alunoOpt = alunoRepository.findById(dto.getIdAluno());
        Optional<Orientador> orientadorOpt = orientadorRepository.findById(dto.getIdOrientador());
        Optional<Curso> cursoOpt = cursoRepository.findById(dto.getIdCurso());
        Optional<Subcategoria> subcategoriaOpt = dto.getIdSubcategoria() != null
                ? subcategoriaRepository.findById(dto.getIdSubcategoria())
                : Optional.empty();

        if (alunoOpt.isEmpty() || orientadorOpt.isEmpty() || cursoOpt.isEmpty()) {
            throw new IllegalArgumentException("Aluno, orientador ou curso inválido(s) ao criar TCC.");
        }

        return new TCC(
                dto.getTitulo(),
                alunoOpt.get(),
                orientadorOpt.get(),
                cursoOpt.get(),
                subcategoriaOpt.orElse(null),
                dto.getResumo(),
                dto.getAnotacoes()
        );
    }

    public TCCDTO toTCCDTO(TCC entity) {
        return new TCCDTO(entity);
    }
}
