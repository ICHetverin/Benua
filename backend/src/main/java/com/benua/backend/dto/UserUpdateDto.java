package com.benua.backend.dto;

import com.benua.backend.model.User;
import jakarta.validation.constraints.Size;

import java.util.Set;

public record UserUpdateDto(
        @Size(min = 6) String password,
        Set<User.Role> roles
) {}
