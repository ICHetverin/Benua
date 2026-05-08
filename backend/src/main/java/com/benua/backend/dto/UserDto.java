package com.benua.backend.dto;

import com.benua.backend.model.User;

import java.time.Instant;
import java.util.Set;

public record UserDto(String _id, String username, Set<User.Role> roles, Instant createdAt, Instant updatedAt) {}
