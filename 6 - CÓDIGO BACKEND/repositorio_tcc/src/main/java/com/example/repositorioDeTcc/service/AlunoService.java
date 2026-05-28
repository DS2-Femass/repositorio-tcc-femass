package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.dto.AlunoMinDTO;
import com.example.repositorioDeTcc.exception.NoDataInFileException;
import com.example.repositorioDeTcc.exception.ResourceNotFoundException;
import com.example.repositorioDeTcc.exception.handler.RequiredObjectIsNullException;
import com.example.repositorioDeTcc.mapper.AlunoMapper;
import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.Turma;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import com.example.repositorioDeTcc.repository.TurmaRepository;
import jakarta.persistence.EntityNotFoundException;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class AlunoService {

    @Autowired
    AlunoRepository repository;

    @Autowired
    AlunoMapper alunoMapper;

    @Autowired
    TurmaRepository turmaRepository;

    @Transactional(readOnly = true)
    public AlunoDTO findById(UUID id){
        Optional<Aluno> obj = repository.findById(id);
        AlunoDTO dto = new AlunoDTO(obj.orElseThrow(() -> new ResourceNotFoundException(id)));
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AlunoMinDTO> findAll(){
        List <Aluno> list = repository.findAllByAtivoIsTrue();
        List<AlunoMinDTO> listDto = list.stream().map(aluno -> new AlunoMinDTO(aluno)).toList();
        return listDto;
    }

    @Transactional(readOnly = true)
    public List<AlunoMinDTO> findByTurmaId(UUID turmaId) {
        return repository.findAllByAtivoIsTrue()
                .stream()
                .filter(a -> a.getTurma() != null && turmaId.equals(a.getTurma().getId()))
                .map(a -> {
                    AlunoMinDTO dto = new AlunoMinDTO();
                    dto.setId(a.getId());
                    dto.setNomeCompleto(a.getNomeCompleto());
                    dto.setMatricula(a.getMatricula());
                    return dto;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    public AlunoDTO insert(AlunoDTO alunoDTO){

        if(alunoDTO == null) throw new RequiredObjectIsNullException();

        Aluno aluno = alunoMapper.fromAlunoDTOToAluno(alunoDTO);
        if (alunoDTO.getTurmaId() != null) {
            Turma turma = turmaRepository.findById(alunoDTO.getTurmaId())
                    .orElseThrow(() -> new ResourceNotFoundException(alunoDTO.getTurmaId()));
            aluno.setTurma(turma);
        }
        return alunoMapper.toAlunoDTO(repository.save(aluno));
    }

    public void delete(UUID id){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        repository.deleteById(id);
    }

    @Transactional
    public AlunoDTO update(UUID id, AlunoDTO obj){
        if(!repository.existsById(id)) throw new ResourceNotFoundException(id);

        Aluno entity = repository.getReferenceById(id);
        updateData(entity, obj);
        return alunoMapper.toAlunoDTO(repository.save(entity));
    }

    private void updateData(Aluno entity, AlunoDTO obj) {
        entity.setNomeCompleto(obj.getNomeCompleto());
        entity.setEmail(obj.getEmail());
        entity.setTelefone(obj.getTelefone());
        if (obj.getTurmaId() != null) {
            Turma turma = turmaRepository.findById(obj.getTurmaId())
                    .orElseThrow(() -> new ResourceNotFoundException(obj.getTurmaId()));
            entity.setTurma(turma);
        } else {
            entity.setTurma(null);
        }
    }

    public Integer importAlunos(MultipartFile file, UUID turmaId) throws IOException {
        String fileName = file.getOriginalFilename();
        if (fileName == null) throw new EntityNotFoundException("File not found");

        Turma turma = null;
        if (turmaId != null) {
            turma = turmaRepository.findById(turmaId)
                    .orElseThrow(() -> new ResourceNotFoundException(turmaId));
        }

        Set<Aluno> alunos;
        if (fileName.endsWith(".csv")) alunos = parseCsv(file);
        else alunos = parseExcel(file);

        if(alunos.isEmpty()) throw new NoDataInFileException();

        if (turma != null) {
            final Turma turmaFinal = turma;
            alunos.forEach(aluno -> aluno.setTurma(turmaFinal));
        }

        repository.saveAll(alunos);
        return alunos.size();
    }

    private Set<Aluno> parseCsv(MultipartFile file) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String headerLine = br.readLine();
            String[] headers = headerLine.split(",");
            Map<String, Integer> headerMap = new HashMap<>();
            for (int i = 0; i < headers.length; i++) {
                headerMap.put(headers[i], i);
            }

            String line;

            Set<Aluno> alunos = new HashSet<>();

            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");

                String matricula = values[headerMap.get("Matrícula")];
                String nome = values[headerMap.get("Nome")];
                String email = values[headerMap.get("E-mail")];
                String telefone = values[headerMap.get("Celular")];
                //Mantendo apenas números no telefone
                telefone = telefone.replaceAll("[^0-9]", "");

                if (repository.existsByMatriculaOrEmail(matricula, email)) continue;

                Aluno aluno = new Aluno(nome, telefone, email, matricula);
                alunos.add(aluno);
            }
            return alunos;
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case NUMERIC:
                // Matrícula e telefone podem vir como número; converte sem casas decimais
                long longVal = (long) cell.getNumericCellValue();
                return String.valueOf(longVal);
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                try { return cell.getStringCellValue(); }
                catch (Exception e) { return String.valueOf((long) cell.getNumericCellValue()); }
            default:
                return cell.getStringCellValue().trim();
        }
    }

    private Set<Aluno> parseExcel(MultipartFile file) throws IOException {

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            Map<String, Integer> headerMap = new HashMap<>();
            for (Cell cell : headerRow) {
                headerMap.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
            }

            Set<Aluno> alunos = new HashSet<>();

            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String matricula = getCellValueAsString(row.getCell(headerMap.get("Matrícula")));
                String nome = getCellValueAsString(row.getCell(headerMap.get("Nome")));
                String email = getCellValueAsString(row.getCell(headerMap.get("E-mail")));
                String telefone = getCellValueAsString(row.getCell(headerMap.get("Celular")));

                if (matricula.isBlank() && nome.isBlank()) continue;

                //Mantendo apenas números no telefone
                telefone = telefone.replaceAll("[^0-9]", "");

                if(repository.existsByMatriculaOrEmail(matricula, email)) continue;

                Aluno aluno = new Aluno(nome, telefone, email, matricula);
                alunos.add(aluno);
            }
            return alunos;
        }
    }

}
