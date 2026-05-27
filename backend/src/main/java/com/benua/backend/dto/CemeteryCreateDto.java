package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record CemeteryCreateDto(
        @JsonProperty("name") String name,
        @JsonProperty("brief_info") String briefInfo,
        @JsonProperty("image_ids") List<String> imageIds
) {}
