package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class CategoriaNotFoundException extends RuntimeException {
    public CategoriaNotFoundException(Long idCategoria) {
        super("Categoria com ID " + idCategoria + " não encontrada.");
    }
}
