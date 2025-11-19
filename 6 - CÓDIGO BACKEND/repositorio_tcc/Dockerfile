# ==========================
# Etapa 1: Build da aplicação
# ==========================
FROM maven:3.9.9-eclipse-temurin-21 AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo pom.xml e baixa as dependências
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia o código-fonte
COPY src ./src

# Compila o projeto sem rodar os testes
RUN mvn clean package -DskipTests

# ==========================
# Etapa 2: Imagem final (leve)
# ==========================
FROM eclipse-temurin:21-jdk

# Define o diretório de trabalho na imagem final
WORKDIR /app

# Copia o JAR gerado da etapa anterior
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta padrão do Spring Boot
EXPOSE 8080

# Define o comando para iniciar o aplicativo
ENTRYPOINT ["java", "-jar", "app.jar"]
