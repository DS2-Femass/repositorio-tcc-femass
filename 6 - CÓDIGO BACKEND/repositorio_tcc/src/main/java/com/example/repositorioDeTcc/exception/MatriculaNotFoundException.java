package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MatriculaNotFoundException extends RuntimeException{

    public MatriculaNotFoundException(){
        super("Matricula not found");
    }
}
