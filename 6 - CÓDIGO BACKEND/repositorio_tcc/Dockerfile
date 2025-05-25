FROM maven:3.9.9-amazoncorretto-21-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM openjdk:21-jdk-slim

EXPOSE 8080
WORKDIR /app

COPY --from=builder /app/target/*.jar /app/repositorioDeTcc.jar

CMD ["java", "-jar", "/app/repositorioDeTcc.jar"]