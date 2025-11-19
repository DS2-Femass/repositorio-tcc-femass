package com.example.repositorioDeTcc.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequestDTO(
        @NotBlank(message = "Current Password cannot be empty") String currentPassword,
        @NotBlank(message = "New Password cannot be empty") String newPassword,
        @NotBlank(message = "Confirm Password cannot be empty")String confirmPassword
) {
}
