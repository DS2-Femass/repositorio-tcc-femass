package com.example.repositorioDeTcc.initialization;

import com.example.repositorioDeTcc.model.Curso;
import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.CursoRepository;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class cursosDataLoader implements CommandLineRunner {

    @Autowired
    CursoRepository cursoRepository;

    @Override
    public void run(String... args) throws Exception {
        List<Curso> cursos = new ArrayList<>();
        if(cursoRepository.existsByNome("Sistemas de Informação") == false) {
            cursos.add(new Curso("Sistemas de Informação"));
        }
        if(cursoRepository.existsByNome("Administração") == false) {
            cursos.add(new Curso("Administração"));
        }
        if(cursoRepository.existsByNome("Matemática") == false) {
            cursos.add(new Curso("Matemática"));
        }
        if(cursoRepository.existsByNome("Engenharia de Produção") == false) {
            cursos.add(new Curso("Engenharia de Produção"));
        }
        if(!cursos.isEmpty()) {
            cursoRepository.saveAll(cursos);
        }
    }
}
