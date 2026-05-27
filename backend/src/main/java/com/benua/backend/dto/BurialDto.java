package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record BurialDto(
        @JsonProperty("_id") String _id,
        String city,
        @JsonProperty("cemetery_name") String cemeteryName,
        String name,
        @JsonProperty("life_years") String lifeYears,
        @JsonProperty("brief_info") String briefInfo,
        @JsonProperty("connected_person_id") String connectedPersonId,
        @JsonProperty("connected_person_name") String connectedPersonName,
        List<ImageDto> images,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("updated_at") Instant updatedAt,
        @JsonProperty("updated_by") String updatedBy
) {}
