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
        @JsonProperty("passing_methods") List<String> passingMethods,
        @JsonProperty("cover_photo") String coverPhoto,
        @JsonProperty("route_photo") String routePhoto,
        @JsonProperty("sources") List<Excursion.ExcursionSource> sources,
        @JsonProperty("points") List<Excursion.ExcursionPoint> points,
        @JsonProperty("audio_url") String audioUrl,
        @JsonProperty("authors") List<String> authors,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("is_published") Boolean isPublished
) {}
