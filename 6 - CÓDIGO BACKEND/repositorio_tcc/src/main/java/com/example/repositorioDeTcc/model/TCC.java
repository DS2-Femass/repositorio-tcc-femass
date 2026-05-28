package com.example.repositorioDeTcc.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table
@NoArgsConstructor
@Data
public class TCC implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id;

    @Column
    private String titulo;

    @ManyToOne(optional = false)
    @JoinColumn(name="id_aluno", referencedColumnName = "id", nullable = false)
    private Aluno aluno;

    @ManyToOne(optional = false)
    @JoinColumn(name="id_orientador", referencedColumnName = "id", nullable = false)
    private Orientador orientador;
    //mudar para relacionamente com a classe curso quando essa existir
    @ManyToOne
    @JoinColumn(name="id_curso", referencedColumnName = "id", nullable = false)
    private Curso curso;
    @ManyToOne
    @JoinColumn(name="id_Subcategoria", referencedColumnName = "id")
    private Subcategoria subcategoria;

    @Column
    private String resumo;

    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "palavra_TCC",
        joinColumns = @JoinColumn(name = "tcc_id"),
        inverseJoinColumns = @JoinColumn(name = "palavra_chave_id")
    )
    private Set<PalavraChave> palavrasChave = new HashSet<>();

    public TCC(String titulo, Aluno aluno, Orientador orientador, Curso curso, Subcategoria subcategoria, String resumo){
        this.titulo = titulo;
        this.aluno = aluno;
        this.orientador = orientador;
        this.curso = curso;
        this.subcategoria = subcategoria;
        this.resumo = resumo;
    }
}
