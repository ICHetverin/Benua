package com.benua.backend.controller;

import com.benua.backend.dto.auth.LoginRequest;
import com.benua.backend.dto.auth.LoginResponse;
import com.benua.backend.model.User;
import com.benua.backend.repository.UserRepository;
import com.benua.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody @Valid LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.username(), req.password())
        );
        Set<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                .collect(Collectors.toSet());

        String token = jwtService.issue(auth.getName(), roles);
        Instant expiresAt = Instant.now().plusMillis(jwtService.getTtlMs());

        return new LoginResponse(token, expiresAt, new LoginResponse.UserResponse(auth.getName(), roles));
    }

    @GetMapping("/me")
    public LoginResponse.UserResponse me(Authentication auth) {
        Set<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(r -> r.startsWith("ROLE_") ? r.substring(5) : r)
                .collect(Collectors.toSet());
        return new LoginResponse.UserResponse(auth.getName(), roles);
    }
}
