package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

public record LoginRequestDTO (String email,String matricula, @NotBlank String password) implements Serializable {

}
