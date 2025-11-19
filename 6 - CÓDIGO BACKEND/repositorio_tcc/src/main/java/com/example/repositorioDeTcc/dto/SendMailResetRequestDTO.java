package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;

public record SendMailResetRequestDTO(
        @NotBlank (message = "Must enter an email") String email
) {
}
