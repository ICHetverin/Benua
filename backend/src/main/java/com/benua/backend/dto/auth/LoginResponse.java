package com.benua.backend.dto.auth;

import java.time.Instant;
import java.util.Set;

public record LoginResponse(
        String token,
        Instant expiresAt,
        UserResponse user
) {
    public record UserResponse(String username, Set<String> roles) {}
}
