package com.example.repositorioDeTcc.mapper;

import com.example.repositorioDeTcc.dto.TCCDTO;
import com.example.repositorioDeTcc.model.Categoria;
import com.example.repositorioDeTcc.model.Orientador;
import com.example.repositorioDeTcc.model.PalavraChave;
import com.example.repositorioDeTcc.model.Subcategoria;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.repository.*;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

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

    @Autowired
    private PalavraChaveRepository palavraChaveRepository;

    public TCC fromTCCDTOToTCC(TCCDTO tccDTO){
        Subcategoria subcategoria = tccDTO.getIdSubcategoria() != null ? subcategoriaRepository.findById(tccDTO.getIdSubcategoria()).get() : null;
        TCC tcc = new TCC(tccDTO.getTitulo(), alunoRepository.findById(tccDTO.getIdAluno()).get(), orientadorRepository.findById(tccDTO.getIdOrientador()).get(),
                cursoRepository.findById(tccDTO.getIdCurso()).get(),subcategoria, tccDTO.getResumo());
        
        // As palavras-chave serão tratadas no service, não aqui
        
        return tcc;
    }

    public TCCDTO toTCCDTO(TCC tcc){
        return new TCCDTO(tcc);
    }
}
