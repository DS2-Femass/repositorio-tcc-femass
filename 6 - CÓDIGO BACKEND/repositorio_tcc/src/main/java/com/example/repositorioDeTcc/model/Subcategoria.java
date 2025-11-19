package com.example.repositorioDeTcc.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Entity
@Table(name = "subcategoria")
public class Subcategoria {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Setter(AccessLevel.NONE)
    private UUID id; 
    @Column(name = "nome_subcategoria", nullable = false, unique = true)
    private String nomeSubcategoria; 
    @Column(name = "descricao_Subcategoria",nullable = false)
    private String descricaoSubcategoria; 
    @ManyToOne(optional = false)
    @JoinColumn(name="id_Categoria", referencedColumnName = "id", nullable = false)
    private Categoria categoria;

    public Subcategoria(String nomeSubcategoria, String descricaoSubcategoria,Categoria categoria){
        this.nomeSubcategoria = nomeSubcategoria;
        this.descricaoSubcategoria = descricaoSubcategoria;
        this.categoria = categoria;
    }
}
