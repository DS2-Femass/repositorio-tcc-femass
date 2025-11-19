package com.example.repositorioDeTcc.repository;

import com.example.repositorioDeTcc.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    UserDetails findByEmail(String email);

    UserDetails findByMatricula(String matricula);


    @Query(
            value = "SELECT tokens FROM used_tokens WHERE tokens = :token",
            nativeQuery = true
    )
    Optional<String> findByUsedToken(@Param("token") String token);

    @Transactional
    @Modifying
    @Query(value = "INSERT INTO used_tokens (tokens) VALUES (:token)", nativeQuery = true)
    void insertToken(@Param("token") String token);

    Boolean existsByMatricula(String matricula);
}
