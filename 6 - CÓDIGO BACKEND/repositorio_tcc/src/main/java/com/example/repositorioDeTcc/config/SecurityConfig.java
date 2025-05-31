package com.example.repositorioDeTcc.config;

import jakarta.servlet.DispatcherType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.example.repositorioDeTcc.model.Role.*;


@EnableWebSecurity
@Configuration
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(
                        authorize -> authorize
                                .requestMatchers(
                                        "/auth/login",
                                        "/auth/register",
                                        "/auth/sendPasswordReset",
                                        "/auth/reset-password/**",
                                        "/auth/first-access",
                                        "/api/v1/auth/**",
                                        "/v3/api-docs/**",
                                        "/swagger-ui.html/**",
                                        "/h2-console/**",
                                        "/swagger-ui/**",
                                        "/v2/api-docs/**",
                                        "/v2/api-docs",
                                        "/v3/api-docs/",
                                        "/swagger-resources",
                                        "/swagger-resources/**",
                                        "/configuration/security",
                                        "/configuration/ui",
                                        "/swagger-ui.html",
                                        "/webjars/**",
                                        "/swagger-ui"
                                ).permitAll()
                                .anyRequest().authenticated()
                )
                .cors(cors -> {})
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    public void configure(WebSecurity web) throws Exception {
        web.ignoring().requestMatchers("/css/**", "/js/**", "/images/**");
    }


    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
