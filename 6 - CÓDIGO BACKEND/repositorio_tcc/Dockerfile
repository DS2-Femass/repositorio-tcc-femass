FROM maven:3.9.9-amazoncorretto-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM amazoncorretto:21-alpine
FROM eclipse-temurin:21-jdk-alpine

EXPOSE 8080
WORKDIR /app

COPY --from=builder /app/target/*.jar /app/repositorioDeTcc.jar

CMD ["java", "-jar", "/app/repositorioDeTcc.jar"]