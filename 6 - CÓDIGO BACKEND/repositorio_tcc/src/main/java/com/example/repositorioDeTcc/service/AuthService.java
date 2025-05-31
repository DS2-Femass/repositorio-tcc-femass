package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.*;
import com.example.repositorioDeTcc.exception.ExceptionResponse;
import com.example.repositorioDeTcc.exception.MustChangePasswordException;
import com.example.repositorioDeTcc.exception.TooManyArgumentsException;
import com.example.repositorioDeTcc.model.*;
import com.example.repositorioDeTcc.repository.AlunoRepository;
import com.example.repositorioDeTcc.repository.OrientadorRepository;
import com.example.repositorioDeTcc.repository.ProfessorTCCRepository;
import com.example.repositorioDeTcc.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Date;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    TokenService tokenService;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    MailService mailService;
    @Autowired
    AlunoRepository alunoRepository;
    @Autowired
    OrientadorRepository orientadorRepository;

    public ResponseEntity<?> login(LoginRequestDTO loginRequestDTO) {

        if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty() &&
                loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
            throw new TooManyArgumentsException("Both email and matricula cannot be provided together.");
        }

        try {
            Authentication auth;
            User user;
            if (loginRequestDTO.email() != null && !loginRequestDTO.email().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.email(), loginRequestDTO.password());
                auth = authenticationManager.authenticate(usernamePassword);
                user = (User) userRepository.findByEmail(loginRequestDTO.email());
            } else if (loginRequestDTO.matricula() != null && !loginRequestDTO.matricula().isEmpty()) {
                UsernamePasswordAuthenticationToken usernamePassword = new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.matricula(), loginRequestDTO.password());
                user = (User) userRepository.findByMatricula(loginRequestDTO.matricula());
                auth = authenticationManager.authenticate(usernamePassword);


            } else {
                return ResponseEntity.badRequest().body(new LoginErroDTO("Email or Matricula must be provided."));
            }
            var token = tokenService.generateToken(user);

            if(user.getMustChangePassword()){
                return ResponseEntity.ok(new LoginResponseMustChangeDTO(token, true));
            }
            return ResponseEntity.ok(new LoginResponseDTO(token));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginErroDTO("Authentication failed: " + e.getMessage()));
        }
    }

    public ResponseEntity<?> register(RegisterUserDTO registerUserDTO) {
        if(userRepository.findByEmail(registerUserDTO.email()) != null) return ResponseEntity.badRequest().body(new LoginErroDTO("Email Already taken"));
        if(userRepository.findByMatricula(registerUserDTO.matricula()) !=null) return ResponseEntity.badRequest().body(new LoginErroDTO("Matricula already taken"));

        String encryptedPassword = new BCryptPasswordEncoder().encode(UUID.randomUUID().toString());
        String role = "USER";
        User newUser = new User(registerUserDTO);
        newUser.setPassword(encryptedPassword);

        User persistedUser = userRepository.save(newUser);

        var token = tokenService.generateToken(persistedUser);

        mailService.sendWelcomeEmail(registerUserDTO, token);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> changePassword(ChangePasswordRequestDTO request, Principal connectedUser) {
        var user = ((User) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal());

        if(!passwordEncoder.matches(request.currentPassword(), user.getPassword())){
            throw new IllegalStateException("Wrong password");
        };
        if(!request.newPassword().equals(request.confirmPassword())){
            throw new IllegalStateException("New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        userRepository.save(user);
        var token = tokenService.generateToken(user);
        return ResponseEntity.ok(new LoginResponseDTO(token));

    }

    public ResponseEntity<?> sendMailReset(SendMailResetRequestDTO request) {
        var user = userRepository.findByEmail(request.email());
        if (user == null){
            return ResponseEntity.ok().build();
        }
        var token = tokenService.generateSingleToken((User) user);
        mailService.sendRecoverPassword(((User) user).getNomeCompleto(), request.email(),token);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> resetPassword(ResetPasswordDTO request,String token) {
        try {
            tokenService.validateToken(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new LoginErroDTO("Invalid token"));
        }
        if(!request.newPassword().equals(request.confirmPassword())){
            throw new IllegalStateException("Password do not match");
        }
        User user = (User) userRepository.findByEmail(tokenService.getClaimFromToken(token, "sub"));
        if(!userRepository.findByUsedToken(token).isEmpty()){
            throw new IllegalStateException("Token already used");
        }
        if (user != null) {
            String encryptedPassword = new BCryptPasswordEncoder().encode(request.newPassword());
            user.setPassword(encryptedPassword);
            userRepository.insertToken(token);
            user.setMustChangePassword(false);
            userRepository.save(user);
            token = tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponseDTO(token));
        }else {
            throw new IllegalStateException("User not found");
        }
    }

    public ResponseEntity<?> firstAccess(PrimeiroAcessoRequestDTO request) {
        String identificador = request.matriculaOuCpf();

        Optional<Aluno> alunoOpt = alunoRepository.findByMatricula(identificador);
        Optional<Orientador> orientadorOpt = orientadorRepository.findByCpf(identificador);

        Optional<Pessoa> pessoaOpt = alunoOpt
                .map(aluno -> (Pessoa) aluno)
                .or(() -> orientadorOpt.map(orientador -> (Pessoa) orientador));

        pessoaOpt.ifPresent(pessoa -> {
            // Se já possui usuário, não faz nada
            if (pessoa.getUser() != null) {
                return;
            }

            String matricula = alunoOpt.map(Aluno::getMatricula).orElse(null);
            String email = pessoa.getEmail();
            String nomeCompleto = pessoa.getNomeCompleto();

            String senhaAleatoria = UUID.randomUUID().toString();

            User newUser = new User(nomeCompleto, matricula, email,
                    new BCryptPasswordEncoder().encode(senhaAleatoria),
                    Role.USER);
            newUser.setMustChangePassword(true);

            userRepository.save(newUser);

            pessoa.setUser(newUser);

            alunoOpt.ifPresentOrElse(
                    aluno -> alunoRepository.save(aluno),
                    () -> orientadorOpt.ifPresent(orientadorRepository::save)
            );

            String token = tokenService.generateSingleToken(newUser);

            mailService.sendWelcomeEmail(
                    new RegisterUserDTO(nomeCompleto, email, matricula, Role.USER, true),
                    token
            );
        });

        // Sempre retorna um OK genérico, sem indicar nada
        return ResponseEntity.ok().build();
    }

}
