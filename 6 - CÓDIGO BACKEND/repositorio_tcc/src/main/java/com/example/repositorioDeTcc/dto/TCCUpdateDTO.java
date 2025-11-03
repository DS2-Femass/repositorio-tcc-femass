package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.PalavraChave;
import com.example.repositorioDeTcc.model.TCC;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class TCCUpdateDTO {
    private UUID id;
    private String titulo;
    private UUID idAluno;
    private UUID idOrientador;
    private UUID idCurso;
    private UUID idSubcategoria;
    private String resumo;
    private List<UUID> idPalavrasChave = new ArrayList<>();
    private List<PalavraChaveDTO> palavrasChave = new ArrayList<>(); // Para palavras-chave novas

    public TCCUpdateDTO(TCC entity){
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.idAluno = entity.getAluno().getId();
        this.idOrientador = entity.getOrientador().getId();
        this.idCurso = entity.getCurso().getId();
        // Verifica se a subcategoria é nula antes de acessar seus atributos
        if(entity.getSubcategoria() != null)
            this.idSubcategoria = entity.getSubcategoria().getId();
        this.resumo = entity.getResumo();
        
        // Mapeia as palavras-chave
        if(entity.getPalavrasChave() != null && !entity.getPalavrasChave().isEmpty()) {
            this.idPalavrasChave = new ArrayList<>();
            for(PalavraChave palavra : entity.getPalavrasChave()) {
                this.idPalavrasChave.add(palavra.getId());
            }
        }
    }
}
