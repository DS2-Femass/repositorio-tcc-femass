package com.example.repositorioDeTcc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class MustChangePasswordException extends RuntimeException {
    public MustChangePasswordException(String message) {
        super(message);
    }
}
