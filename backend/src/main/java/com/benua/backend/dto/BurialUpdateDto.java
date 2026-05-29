package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record BurialUpdateDto(
        @JsonProperty("region") String region,
        @JsonProperty("russia_region") String russiaRegion,
        @JsonProperty("cemetery_id") String cemeteryId,
        @JsonProperty("city") String city,
        @JsonProperty("cemetery_name") String cemeteryName,
        @JsonProperty("name") String name,
        @JsonProperty("life_years") String lifeYears,
        @JsonProperty("brief_info") String briefInfo,
        @JsonProperty("connected_person_id") String connectedPersonId,
        @JsonProperty("image_ids") List<String> imageIds,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("sort_order") Integer sortOrder
) {}
