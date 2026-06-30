package com.example.repositorioDeTcc.dto;

import java.io.Serializable;

public record LoginResponseDTO(String token, String role) implements Serializable {
}
