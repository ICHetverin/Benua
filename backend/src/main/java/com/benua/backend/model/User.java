package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.Set;

@Document(collection = "users")
public record User(
        @Id String _id,
        @Indexed(unique = true) @NotBlank @Size(max = 64) String username,
        @NotBlank String passwordHash,
        @NotEmpty Set<Role> roles,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt
) {
    public enum Role { ADMIN, EDITOR }
}
