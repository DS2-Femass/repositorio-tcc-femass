package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.EntregaAtividadeDTO;
import com.example.repositorioDeTcc.dto.LancarNotaDTO;
import com.example.repositorioDeTcc.service.EntregaAtividadeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping(value = "/entregas-atividade")
@CrossOrigin
public class EntregaAtividadeController {

    @Autowired
    EntregaAtividadeService service;

    @GetMapping(value = "/{id}")
    public ResponseEntity<EntregaAtividadeDTO> findById(@PathVariable UUID id) {
        EntregaAtividadeDTO result = service.findById(id);
        return ResponseEntity.ok().body(result);
    }

    /**
     * Aluno envia sua entrega (com arquivo anexo).
     */
    @PostMapping(value = "/entregar/{atividadeId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<EntregaAtividadeDTO> entregar(
            @PathVariable UUID atividadeId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Principal connectedUser) throws IOException {
        EntregaAtividadeDTO result = service.entregar(atividadeId, file, connectedUser);
        return ResponseEntity.ok().body(result);
    }

    /**
     * Professor lança nota para uma entrega.
     */
    @PatchMapping(value = "/{id}/nota", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<EntregaAtividadeDTO> lancarNota(
            @PathVariable UUID id,
            @Valid @RequestBody LancarNotaDTO dto) {
        EntregaAtividadeDTO result = service.lancarNota(id, dto);
        return ResponseEntity.ok().body(result);
    }

    /**
     * Download do arquivo de entrega.
     */
    @GetMapping(value = "/{id}/arquivo")
    public ResponseEntity<Resource> downloadArquivo(@PathVariable UUID id) throws MalformedURLException {
        Resource resource = service.downloadArquivo(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
