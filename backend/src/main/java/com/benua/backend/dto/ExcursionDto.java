package com.benua.backend.dto;

import com.benua.backend.model.Excursion;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record ExcursionDto(
        @JsonProperty("_id") String _id,
        String name,
        String description,
        String time,
        String guide,
        List<String> passingMethods,
        List<String> keyPoints,
        List<Excursion.ContentSection> textContent,
        String coverPhoto,
        String routePhoto,
        List<Excursion.ExcursionSource> sources,
        Boolean isPublished,
        Integer sortOrder,
        Instant createdAt,
        Instant updatedAt
) {}
