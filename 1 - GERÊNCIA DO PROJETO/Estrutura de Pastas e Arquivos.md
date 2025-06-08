# Estrutura de Pastas e Arquivos do Backend

Esta seção detalha a organização das pastas e arquivos do projeto backend, localizado em `.../repositorio-tcc-femass/6 - CÓDIGO BACKEND/repositorio_tcc`. A estrutura segue convenções comuns em projetos Spring Boot, facilitando a manutenção e o desenvolvimento.

## Visão Geral da Estrutura

O código-fonte do backend está organizado dentro do diretório `src`, que se divide principalmente em `main` (código da aplicação) e `test` (código de testes). Dentro de `src/main/java`, encontramos os pacotes Java que contêm a lógica da aplicação, enquanto `src/main/resources` armazena arquivos de configuração e outros recursos.

### Diretório Principal: `src/main/java/com/example/repositorioDeTcc`

Este é o pacote raiz da aplicação Java e contém os subpacotes que organizam as diferentes camadas e componentes do sistema:

*   **`config`**: Contém classes de configuração da aplicação, como a configuração de segurança (`SecurityConfig`, `SecurityFilter`), configuração de CORS (`CorsConfig`), configuração do Swagger/OpenAPI (`OpenApiConfig`) para documentação da API, e configurações relacionadas a beans específicos como o `ApplicationConfig`.
*   **`controller`**: Responsável pela camada de apresentação da API REST. As classes neste pacote (ex: `AlunoController`, `AuthController`, `TCCController`) recebem as requisições HTTP, processam os dados de entrada (geralmente DTOs), invocam os serviços correspondentes na camada de negócio e retornam as respostas HTTP adequadas.
*   **`dto`**: (Data Transfer Object) Define as classes usadas para transferir dados entre as camadas da aplicação, especialmente entre a camada de controle e os clientes da API. Exemplos incluem `LoginRequestDTO`, `AlunoDTO`, `TCCDTO`, etc. O uso de DTOs ajuda a desacoplar a representação interna dos dados (entidades) da representação exposta pela API.
*   **`exception`**: Contém classes de exceções personalizadas criadas para lidar com situações de erro específicas da aplicação (ex: `MustChangePasswordException`, `TooManyArgumentsException`) e um handler global (`GlobalExceptionHandler`) para tratar exceções de forma centralizada e retornar respostas de erro padronizadas.
*   **`model`**: Representa a camada de domínio da aplicação. Contém as classes de entidade JPA (ex: `User`, `Aluno`, `TCC`, `Categoria`) que mapeiam as tabelas do banco de dados. Essas classes definem os atributos e relacionamentos das entidades do sistema.
*   **`repository`**: Define as interfaces que estendem o Spring Data JPA (ex: `JpaRepository`). Essas interfaces (`AlunoRepository`, `TCCRepository`, `UserRepository`) fornecem métodos para realizar operações de persistência de dados (CRUD e consultas customizadas) com as entidades correspondentes no banco de dados, abstraindo a complexidade do acesso direto ao banco.
*   **`service`**: Contém a lógica de negócio da aplicação. As classes de serviço (ex: `AlunoService`, `AuthService`, `TCCService`) orquestram as operações, aplicam regras de negócio, interagem com os repositórios para acessar e manipular dados, e são invocadas pelos controladores. Serviços auxiliares como `MailService` e `TokenService` também residem aqui.

### Diretório de Recursos: `src/main/resources`

Este diretório armazena arquivos que não são código Java, mas são necessários para a execução da aplicação:

*   **`application.yaml`**: Arquivo principal de configuração do Spring Boot, onde são definidas propriedades como configuração do banco de dados, porta do servidor, configurações de segurança, logging, etc. O formato YAML é utilizado pela sua legibilidade.
*   **`db/migration`**: Contém os scripts SQL de migração do banco de dados gerenciados pelo Flyway. Cada arquivo versionado (ex: `V1__Create_Table_Users.sql`, `V10__Create_Table_Categoria.sql`) representa uma alteração no esquema do banco de dados, garantindo que a estrutura do banco evolua de forma controlada e consistente entre diferentes ambientes.

### Diretório de Testes: `src/test`

Contém o código para testes automatizados da aplicação, seguindo uma estrutura de pacotes espelhada à do código principal. Inclui testes unitários e de integração para garantir a qualidade e o correto funcionamento do backend.

Essa estrutura modular e bem definida facilita a compreensão do código, a colaboração entre desenvolvedores e a manutenção do sistema a longo prazo.
