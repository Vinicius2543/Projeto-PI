package com.backend.projectbank.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "receitas")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String ingredientes;
    private String modoPreparo;
    private Integer tempoPreparo;
    private String categoria;
    private String imagemUrl;
    private String tipo;
    private String descricao;
}
