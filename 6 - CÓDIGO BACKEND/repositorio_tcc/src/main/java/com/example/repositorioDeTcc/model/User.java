package com.example.repositorioDeTcc.model;

import com.example.repositorioDeTcc.dto.RegisterUserDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
public class User implements Serializable, UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String nomeCompleto;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String matricula;

    @Setter
    private String password;

    private Boolean enabled;

    private Boolean mustChangePassword;


    @Enumerated(EnumType.STRING)
    private Role role;

    public User(String nomeCompleto, String matricula, String email, String password, Role role){
        this.nomeCompleto = nomeCompleto;
        this.matricula = matricula;
        this.email = email;
        this.password = password;
        this.role = role;
        this.enabled = true;
        this.mustChangePassword = true;
    }

    public User(RegisterUserDTO dadosDto){
        this.nomeCompleto = dadosDto.nomeCompleto();
        this.matricula = dadosDto.matricula();
        this.email = dadosDto.email();
        this.role = dadosDto.role();
        this.enabled = true;
        if(dadosDto.mustChangePassword()!=null){
            this.mustChangePassword = dadosDto.mustChangePassword();
        }else {
            this.mustChangePassword = true;
        }
        if(dadosDto.role()!=null){
            this.role = dadosDto.role();
        }else{
            this.role = Role.USER;
        }
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}
