package com.benua.backend.dto;

import com.benua.backend.model.PublicExcursion;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PublicExcursionDto(
        @JsonProperty("_id") String _id,
        String name,
        String description,
        String time,
        String guide,
        List<String> passingMethods,
        List<String> keyPoints,
        List<PublicExcursion.ContentSection> textContent,
        String coverPhoto,
        String routePhoto,
        List<PublicExcursion.ExcursionSource> sources,
        Boolean isPublished,
        Integer sortOrder
) {}
