package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record CemeteryDto(
        @JsonProperty("_id") String _id,
        String name,
        @JsonProperty("brief_info") String briefInfo,
        List<ImageDto> images,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("updated_at") Instant updatedAt,
        @JsonProperty("updated_by") String updatedBy
) {}
