package com.benua.backend.dto;

import com.benua.backend.model.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.Set;

public record UserDto(@JsonProperty("_id") String _id, String username, Set<User.Role> roles, Instant createdAt, Instant updatedAt) {}
