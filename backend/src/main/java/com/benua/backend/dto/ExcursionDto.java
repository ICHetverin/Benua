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
        List<String> passingMethods,
        String coverPhoto,
        String routePhoto,
        List<Excursion.ExcursionSource> sources,
        List<Excursion.ExcursionPoint> points,
        String audioUrl,
        List<String> authors,
        Boolean isPublished,
        Integer sortOrder,
        Instant createdAt,
        Instant updatedAt
) {}
