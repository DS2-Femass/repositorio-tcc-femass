package com.example.repositorioDeTcc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class RepositorioDeTccApplication {

	public static void main(String[] args) {
		SpringApplication.run(RepositorioDeTccApplication.class, args);
	}

}
