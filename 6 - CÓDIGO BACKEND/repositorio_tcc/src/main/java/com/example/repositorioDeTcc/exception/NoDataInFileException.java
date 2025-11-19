package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NoDataInFileException extends RuntimeException{

    public NoDataInFileException(){
        super("No valid data found in file");
    }
}
