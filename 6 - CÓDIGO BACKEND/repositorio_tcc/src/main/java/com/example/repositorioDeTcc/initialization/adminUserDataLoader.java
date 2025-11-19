package com.example.repositorioDeTcc.initialization;

import com.example.repositorioDeTcc.model.Role;
import com.example.repositorioDeTcc.model.User;
import com.example.repositorioDeTcc.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class adminUserDataLoader implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByMatricula("000000")) {
            String encryptedPassword = new BCryptPasswordEncoder().encode("admin");
            User admin = new User("Administrador", "000000", "admin@admin.com", encryptedPassword, Role.valueOf("ADMIN"));
            admin.setMustChangePassword(false);

            userRepository.save(admin);
        }
    }
}
