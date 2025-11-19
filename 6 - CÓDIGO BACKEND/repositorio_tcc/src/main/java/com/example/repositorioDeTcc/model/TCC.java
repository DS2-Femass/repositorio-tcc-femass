package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.UUID;

@Entity
@Table(name = "tcc")
@NoArgsConstructor
@Data
public class TCC implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_aluno", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name = "id_orientador", referencedColumnName = "id", nullable = false)
    private Orientador orientador;

    // Quando a classe Curso existir, manter o relacionamento
    @ManyToOne(optional = false)
    @JoinColumn(name = "id_curso", referencedColumnName = "id", nullable = false)
    private Curso curso;

    @ManyToOne
    @JoinColumn(name = "id_subcategoria", referencedColumnName = "id")
    private Subcategoria subcategoria;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(columnDefinition = "TEXT")
    private String anotacoes;

    public TCC(String titulo, Aluno aluno, Orientador orientador,
               Curso curso, Subcategoria subcategoria,
               String resumo, String anotacoes) {
        this.titulo = titulo;
        this.aluno = aluno;
        this.orientador = orientador;
        this.curso = curso;
        this.subcategoria = subcategoria;
        this.resumo = resumo;
        this.anotacoes = anotacoes;
    }
}
