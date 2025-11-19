package com.example.repositorioDeTcc.service;

import com.example.repositorioDeTcc.dto.RegisterUserDTO;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Value("${spring.mail.username}")
    String sender;

    @Value("${frontend.url}")
    String frontendUrl;

    private final JavaMailSender mailSender;


    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("femasstcc@outlook.com");

        mailSender.send(message);
        System.out.println("E-mail enviado com sucesso para " + to);
    }


    @Async
    public void sendRecoverPassword(String person, String to, String token) {
        String subject = "Password reset";
        String rota = frontendUrl + "/reset-password?token=" + token;
        String htmlContent = String.format(
                """
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                text-align: center;
            }
    
            .container {
                text-align: center;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
            }
    
            p {
                color: rgb(0, 0, 0) !important;
            }
    
            .button p{
                color: rgb(255, 255, 255) !important;
            }
    
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007BFF;
                border: none;
                border-radius: 5px;
                text-decoration: none;
                transition: background-color 0.3s;
            }
    
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Olá, %s!</h1>
            <p>Esqueceu sua senha? Sem problemas, aqui está seu link para redefini-la:</p>
            <a class="button" href="%s&toemail=%s"><p> Clique aqui para redefinir sua senha</p></a>
            <p>Atenciosamente,<br>FaculdaEnde Professor Miguel Angelo da Silva Santos</p>
        </div>
    </body>
    </html>
                """, person,rota , to
        );


        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(sender);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(RegisterUserDTO registerUserDTO, String token) {
        String subject = "Bem vindo ao TCC Flow - Repositório de TCC da Femass";
        String rota = frontendUrl + "/reset-password?token=" + token + "&toemail=" + registerUserDTO.email();
        String htmlContent = String.format(
                """
    <html>
    <head>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                text-align: center;
            }
    
            .container {
                text-align: center;
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 5px;
            }
    
            p {
                color: rgb(0, 0, 0) !important;
            }
    
            .button p{
                color: rgb(255, 255, 255) !important;
            }
    
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007BFF;
                border: none;
                border-radius: 5px;
                text-decoration: none;
                transition: background-color 0.3s;
            }
    
            .button:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Olá, %s!</h1>
            <h2>O seu cadastro no sistema de TCCs da femass foi criado com sucesso, bem vindo!</h2>
            <h3>Seu usuário é: [%s] ou [%s]</h3>
            <a class="button" href="%s"><p> Clique aqui para definir sua senha</p></a>
            <p>Atenciosamente,<br>Faculdade Professor Miguel Angelo da Silva Santos</p>
        </div>
    </body>
    </html>
                """, registerUserDTO.nomeCompleto(), registerUserDTO.matricula(), registerUserDTO.email(), rota);


        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(registerUserDTO.email());
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.setFrom(sender);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }
    }
