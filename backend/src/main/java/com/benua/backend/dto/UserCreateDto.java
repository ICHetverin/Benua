package com.benua.backend.dto;

import com.benua.backend.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserCreateDto(
        @NotBlank @Size(max = 64) String username,
        @NotBlank @Size(min = 6) String password,
        @NotEmpty Set<User.Role> roles
) {}
