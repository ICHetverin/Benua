package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record BurialCreateDto(
        @JsonProperty("region") String region,
        @JsonProperty("cemetery_id") String cemeteryId,
        @JsonProperty("city") String city,
        @JsonProperty("cemetery_name") String cemeteryName,
        @JsonProperty("name") String name,
        @JsonProperty("life_years") String lifeYears,
        @JsonProperty("brief_info") String briefInfo,
        @JsonProperty("connected_person_id") String connectedPersonId,
        @JsonProperty("images") List<ImageCreateDto> images,
        @JsonProperty("image_ids") List<String> imageIds
) {}
