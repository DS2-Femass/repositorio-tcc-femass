package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.dto.AlunoMinDTO;
import com.example.repositorioDeTcc.dto.TCCDTO;
import com.example.repositorioDeTcc.dto.TCCMinDTO;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.AlunoMapper;
import com.example.repositorioDeTcc.mapper.TCCMapper;
import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import com.example.repositorioDeTcc.repository.CategoriaRepository;
import com.example.repositorioDeTcc.repository.OrientadorRepository;
import com.example.repositorioDeTcc.repository.TCCRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TCCService {

    @Autowired
    AlunoRepository alunoRepository;

    @Autowired
    OrientadorRepository orientadorRepository;
    
    @Autowired
    CategoriaRepository categoriaRepository;

    @Autowired
    TCCRepository repository;

    @Autowired
    TCCMapper tccMapper;

    @Transactional(readOnly = true)
    public TCCDTO findById(UUID id){
        Optional<TCC> obj = repository.findById(id);
        TCCDTO dto = new TCCDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<TCCMinDTO> findAll(){
        List <TCC> list = repository.findAll();
        List<TCCMinDTO> listDto = list.stream().map(tcc -> new TCCMinDTO(tcc)).toList();
        return listDto;
    }

    public TCCDTO insert(TCCDTO tccDTO){

        if(tccDTO == null) throw new RequiredObjectIsNullException();

        TCC tcc = tccMapper.fromTCCDTOToTCC(tccDTO);
        return tccMapper.toTCCDTO(repository.save(tcc));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        repository.deleteById(id);
    }

    @Transactional
    public TCCDTO update(UUID id, TCCDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        TCC entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return tccMapper.toTCCDTO(repository.save(entity));
    }

    private void updateData(TCC entity, TCCDTO obj) {
        entity.setResumo(obj.getResumo());
        entity.setTitulo(obj.getTitulo());
        entity.setOrientador(orientadorRepository.findById(obj.getIdOrientador()).orElseThrow(() -> new ResourceNotFoundException(obj.getIdOrientador())));
        entity.setCategoria(categoriaRepository.findById(obj.getIdCategoria()).orElseThrow(() -> new ResourceNotFoundException(obj.getIdCategoria())));
    }
}
