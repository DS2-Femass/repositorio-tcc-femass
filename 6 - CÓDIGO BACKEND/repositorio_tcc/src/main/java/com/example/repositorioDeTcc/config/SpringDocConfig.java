package com.example.repositorioDeTcc.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
      info = @Info(
              description = "Documentação API repositorio de TCCs",
              title = "API Repositorio de TCCs",
              version = "1.0"
      ),
        servers = {@Server(
                description = "Local DEV",
                url = "http://localhost:8080"
        ),
                @Server(
                        description = "Produção",
                        url = "https://repositorio-tcc.onrender.com"
                )
        },
        security = {
              @SecurityRequirement(
                      name = "bearerAuth"
              )
        }

)
@SecurityScheme(
        name = "bearerAuth",
        description = "Token de autenticação",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class SpringDocConfig {
}
