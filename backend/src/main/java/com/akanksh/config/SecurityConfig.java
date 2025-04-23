package com.akanksh.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.client.RestTemplate;

import com.akanksh.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String AUTH_SERVER_URL = "http://localhost:3000/auth/verify-jwt";

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/polls").authenticated()
                .requestMatchers(HttpMethod.PUT, "/polls/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/polls/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/polls/**").authenticated()
                .anyRequest().permitAll()
            )
            .addFilterBefore(
                jwtAuthenticationFilter(),
                BasicAuthenticationFilter.class // Replaces UsernamePasswordAuthenticationFilter
            )
            .build();
    }

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(restTemplate(), AUTH_SERVER_URL);
    }

    @Bean
    RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
