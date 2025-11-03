package com.example.repositorioDeTcc.dto;

import com.example.repositorioDeTcc.model.Aluno;
import com.example.repositorioDeTcc.model.TCC;
import com.example.repositorioDeTcc.model.Categoria;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@NoArgsConstructor
@Getter
@Setter
public class TCCMinDTO {
    private UUID id;
    private String titulo;
    private UUID idAluno;
    private String nomeCompletoAluno;
    private UUID idOrientador;
    private String nomeCompletoOrientador;
    private UUID idCurso;
    private UUID idSubcategoria;
    private List<PalavraChaveDTO> palavrasChave = new ArrayList<>();

    public TCCMinDTO(TCC entity){
        this.id = entity.getId();
        this.titulo = entity.getTitulo();
        this.idAluno = entity.getAluno().getId();
        this.nomeCompletoAluno = entity.getAluno().getNomeCompleto();
        this.idOrientador = entity.getOrientador().getId();
        this.nomeCompletoOrientador = entity.getOrientador().getNomeCompleto();
        this.idCurso = entity.getCurso().getId();
        // Verifica se a subcategoria é nula antes de acessar seus atributos
        if(entity.getSubcategoria() != null)
            this.idSubcategoria = entity.getSubcategoria().getId();
        
        // Adiciona palavras-chave
        if(entity.getPalavrasChave() != null && !entity.getPalavrasChave().isEmpty()) {
            this.palavrasChave = new ArrayList<>();
            entity.getPalavrasChave().forEach(p -> this.palavrasChave.add(new PalavraChaveDTO(p)));
        }
    }
}
