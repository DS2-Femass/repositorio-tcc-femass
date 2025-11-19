package com.example.repositorioDeTcc.exception;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class CategoriaComSubcategoriasException extends RuntimeException {
    public CategoriaComSubcategoriasException(UUID idCategoria) {
        super("A categoria com ID " + idCategoria + " possui subcategorias associadas e não pode ser excluída.");
    }
}
