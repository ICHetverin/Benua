package com.benua.backend.dto;

import com.benua.backend.model.Excursion;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExcursionCreateDto(
        @NotBlank @Size(max = 255) @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("time") String time,
        @JsonProperty("guide") String guide,
        @JsonProperty("passing_methods") List<String> passingMethods,
        @JsonProperty("key_points") List<String> keyPoints,
        @JsonProperty("text_content") List<Excursion.ContentSection> textContent,
        @JsonProperty("cover_photo") String coverPhoto,
        @JsonProperty("route_photo") String routePhoto,
        @JsonProperty("sources") List<Excursion.ExcursionSource> sources,
        @JsonProperty("type") String type,
        @JsonProperty("points") List<Excursion.ExcursionPoint> points,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("is_published") Boolean isPublished
) {}
