package com.benua.backend.controller;

import com.benua.backend.dto.UserCreateDto;
import com.benua.backend.dto.UserDto;
import com.benua.backend.model.User;
import com.benua.backend.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UserDto> list() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto create(@RequestBody @Valid UserCreateDto dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new IllegalArgumentException("Пользователь уже существует: " + dto.username());
        }
        Instant now = Instant.now();
        User saved = userRepository.save(new User(null, dto.username(),
                passwordEncoder.encode(dto.password()), dto.roles(), now, now));
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        userRepository.findById(id).orElseThrow(() -> new NoSuchElementException("User not found: " + id));
        userRepository.deleteById(id);
    }

    private UserDto toDto(User u) {
        return new UserDto(u._id(), u.username(), u.roles(), u.createdAt(), u.updatedAt());
    }
}
