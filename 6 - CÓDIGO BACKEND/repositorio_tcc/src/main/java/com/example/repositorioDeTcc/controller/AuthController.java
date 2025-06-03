package com.example.repositorioDeTcc.controller;

import com.example.repositorioDeTcc.dto.*;
import com.example.repositorioDeTcc.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@CrossOrigin
@RequestMapping("auth")
@Tag(name = "Autenticação")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequestDTO loginRequestDTO){
        return authService.login(loginRequestDTO);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterUserDTO registerUserDTO){
        return authService.register(registerUserDTO);
    }

    @PatchMapping("/changePassword")
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequestDTO request, Principal connectedUser){
        return authService.changePassword(request, connectedUser);
    }

    @PostMapping("/sendPasswordReset")
    public ResponseEntity<?> sendPasswordResetToken(@RequestBody @Valid SendMailResetRequestDTO request){
        return authService.sendMailReset(request);
    }

    @PatchMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(@PathVariable String token, @Valid @RequestBody ResetPasswordDTO request){
        return authService.resetPassword(request, token);
    }

    @PostMapping("/first-access")
    public ResponseEntity<?> firstAcess(@RequestBody PrimeiroAcessoRequestDTO request) {
        return authService.firstAccess(request);
    }

}
