package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.*;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.model.Atividade;
import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.EntregaAtividade;
import com.example.repositorioDeTcc.model.Turma;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import com.example.repositorioDeTcc.repository.AtividadeRepository;
import com.example.repositorioDeTcc.repository.EntregaAtividadeRepository;
import com.example.repositorioDeTcc.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AtividadeService {

    @Autowired
    AtividadeRepository atividadeRepository;

    @Autowired
    TurmaRepository turmaRepository;

    @Autowired
    AlunoRepository alunoRepository;

    @Autowired
    EntregaAtividadeRepository entregaRepository;

    @Transactional(readOnly = true)
    public AtividadeDTO findById(UUID id) {
        Optional<Atividade> obj = atividadeRepository.findById(id);
        return new AtividadeDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
    }

    @Transactional(readOnly = true)
    public List<AtividadeDTO> findAll() {
        return atividadeRepository.findAll().stream()
                .map(AtividadeDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Retorna visão flat para o professor: todos os alunos da turma x todas as atividades,
     * com LEFT JOIN nas entregas (entrega pode ser null se aluno ainda não entregou).
     */
    @Transactional(readOnly = true)
    public List<AtividadeProfessorDTO> findAllForProfessor(UUID turmaId) {
        if (!turmaRepository.existsById(turmaId)) throw new ResourceNotFoundException(turmaId);

        List<Atividade> atividades = atividadeRepository.findAllByTurmaId(turmaId);
        List<Aluno> alunos = alunoRepository.findAllByTurmaId(turmaId);

        List<AtividadeProfessorDTO> resultado = new ArrayList<>();

        for (Atividade atividade : atividades) {
            if (alunos.isEmpty()) {
                resultado.add(new AtividadeProfessorDTO(
                        atividade.getId(), atividade.getDescricao(), atividade.getDataEntrega(),
                        null, null, null, null, null, null
                ));
            } else {
                for (Aluno aluno : alunos) {
                    Optional<EntregaAtividade> entregaOpt =
                            entregaRepository.findByAtividadeIdAndAlunoId(atividade.getId(), aluno.getId());

                    resultado.add(new AtividadeProfessorDTO(
                            atividade.getId(), atividade.getDescricao(), atividade.getDataEntrega(),
                            aluno.getId(), aluno.getNomeCompleto(),
                            entregaOpt.map(EntregaAtividade::getId).orElse(null),
                            entregaOpt.map(EntregaAtividade::getDataRealizacao).orElse(null),
                            entregaOpt.map(EntregaAtividade::getNota).orElse(null),
                            entregaOpt.map(EntregaAtividade::getArquivoNome).orElse(null)
                    ));
                }
            }
        }
        return resultado;
    }

    /**
     * Retorna atividades do aluno logado com suas respectivas entregas.
     */
    @Transactional(readOnly = true)
    public List<EntregaAtividadeDTO> findMine(Principal connectedUser) {
        String email = connectedUser.getName();
        Optional<Aluno> alunoOpt = alunoRepository.findByEmail(email);
        if (alunoOpt.isEmpty()) {
            throw new RuntimeException("Aluno não encontrado para o usuário logado");
        }
        Aluno aluno = alunoOpt.get();

        List<Atividade> atividades = aluno.getTurma() != null
                ? atividadeRepository.findAllByTurmaId(aluno.getTurma().getId())
                : new ArrayList<>();

        return atividades.stream().map(atividade -> {
            Optional<EntregaAtividade> entregaOpt =
                    entregaRepository.findByAtividadeIdAndAlunoId(atividade.getId(), aluno.getId());

            if (entregaOpt.isPresent()) {
                return new EntregaAtividadeDTO(entregaOpt.get());
            } else {
                EntregaAtividadeDTO dto = new EntregaAtividadeDTO();
                dto.setIdAtividade(atividade.getId());
                dto.setDescricaoAtividade(atividade.getDescricao());
                dto.setDataEntrega(atividade.getDataEntrega());
                dto.setIdAluno(aluno.getId());
                dto.setNomeAluno(aluno.getNomeCompleto());
                return dto;
            }
        }).collect(Collectors.toList());
    }

    @Transactional
    public AtividadeDTO insert(AtividadeCreateDTO dto) {
        Optional<Turma> turmaOpt = turmaRepository.findById(dto.getIdTurma());
        if (turmaOpt.isEmpty()) throw new ResourceNotFoundException(dto.getIdTurma());

        Atividade atividade = new Atividade(dto.getDescricao(), dto.getDataEntrega(), turmaOpt.get());
        return new AtividadeDTO(atividadeRepository.save(atividade));
    }

    @Transactional
    public AtividadeDTO update(UUID id, AtividadeUpdateDTO dto) {
        if (!atividadeRepository.existsById(id)) throw new ResourceNotFoundException(id);
        Atividade entity = atividadeRepository.getReferenceById(id);
        if (dto.getDescricao() != null && !dto.getDescricao().isBlank()) {
            entity.setDescricao(dto.getDescricao());
        }
        if (dto.getDataEntrega() != null) {
            entity.setDataEntrega(dto.getDataEntrega());
        }
        return new AtividadeDTO(atividadeRepository.save(entity));
    }

    @Transactional
    public void delete(UUID id) {
        if (!atividadeRepository.existsById(id)) throw new ResourceNotFoundException(id);
        atividadeRepository.deleteById(id);
    }
}
