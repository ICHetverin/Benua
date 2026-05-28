package com.benua.backend.dto;

import com.benua.backend.model.Source;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record InfographicDto(
        @JsonProperty("_id") String _id,
        String name,
        String description,
        List<String> authors,
        @JsonProperty("connected_persons") List<SimpleEntity> connectedPersons,
        @JsonProperty("connected_objects") List<SimpleEntity> connectedObjects,
        List<Source> sources,
        @JsonProperty("file_url") String fileUrl,
        @JsonProperty("file_key") String fileKey,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("created_at") Instant createdAt,
        @JsonProperty("updated_at") Instant updatedAt
) {
    public record SimpleEntity(@JsonProperty("_id") String _id, String name) {}
}
