package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class TooManyArgumentsException extends RuntimeException{
    public TooManyArgumentsException(String message) {
        super(message);
    }

}
