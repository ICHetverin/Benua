package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "object_types")
public record ObjectType(
        @Id String _id,
        @NotBlank(message = "Name is required") @Size(max = 255, message = "Name too long (max=255)") String name,
        List<@Size(max = 255, message = "Subtype too long (max=255)") String> subtypes
) {}
