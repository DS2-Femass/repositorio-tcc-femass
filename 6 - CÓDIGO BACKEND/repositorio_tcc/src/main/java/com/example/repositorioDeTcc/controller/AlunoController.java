package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.AlunoDTO;
import com.example.repositorioDeTcc.dto.AlunoMinDTO;
import com.example.repositorioDeTcc.service.AlunoService;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(value = "/alunos")
@CrossOrigin
@PreAuthorize("hasAnyRole('USER','ADMIN','MODERATOR')")
public class AlunoController {

    @Autowired
    AlunoService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<AlunoDTO> findById(@PathVariable UUID id){
        AlunoDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    @GetMapping
    public ResponseEntity<List<AlunoMinDTO>> findAll(){
        List<AlunoMinDTO> result = service.findAll();
        return ResponseEntity.ok().body(result);
    }

    @GetMapping(value = "/turma/{turmaId}")
    public ResponseEntity<List<AlunoMinDTO>> findByTurma(@PathVariable UUID turmaId){
        List<AlunoMinDTO> result = service.findByTurmaId(turmaId);
        return ResponseEntity.ok().body(result);
    }

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AlunoDTO> create(@RequestBody AlunoDTO aluno){

        aluno = service.insert(aluno);
        return ResponseEntity.ok().body(aluno);
    }

    @PutMapping(value = "/{id}" , produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AlunoDTO> update(@PathVariable UUID id, @RequestBody AlunoDTO aluno){

        aluno = service.update(id, aluno);
        return ResponseEntity.ok().body(aluno);

    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<?> delete(@PathVariable(value = "id")UUID id){
        service.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping(value = "/import", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> importAlunos(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) UUID turmaId
    ) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(-1); // Arquivo vazio
            }

            String contentType = file.getContentType();
            String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
            boolean isExcel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet".equals(contentType)
                    || "application/vnd.ms-excel".equals(contentType)
                    || "application/excel".equals(contentType)
                    || originalFilename.endsWith(".xls")
                    || originalFilename.endsWith(".xlsx");
            boolean isCsv = "text/csv".equals(contentType)
                    || "application/csv".equals(contentType)
                    || originalFilename.endsWith(".csv");
            if (contentType == null || (!isExcel && !isCsv)) {
                return ResponseEntity.badRequest().body(-2); // Tipo de arquivo inválido
            }

            int alunosImportados = service.importAlunos(file, turmaId);
            return ResponseEntity.ok().body(alunosImportados);
        } catch (IOException e) {
            // Log do erro
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(-3); // Erro de IO
        } catch (Exception e) {
            // Log do erro
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(-4); // Outros erros
        }
    }
}
