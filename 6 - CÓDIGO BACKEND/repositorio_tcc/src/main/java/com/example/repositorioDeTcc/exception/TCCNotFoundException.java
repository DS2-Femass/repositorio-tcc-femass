package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.UUID;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TCCNotFoundException extends RuntimeException{

    public TCCNotFoundException(){
        super("TCC not found.");
    }
}
