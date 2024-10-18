package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDTO(
        @NotBlank(message = "Must enter a password") String newPasswod,
        @NotBlank(message = "Must confirm password") String confirmPassword
) {
}
