package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public record ActivityDto(
        @JsonProperty("_id") String _id,
        String name,
        String entityType,
        Instant updatedAt,
        String updatedBy
) {}
