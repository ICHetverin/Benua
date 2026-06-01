package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record InfographicUpdateDto(
        @JsonProperty("name") String name,
        @JsonProperty("description") String description,
        @JsonProperty("authors") List<String> authors,
        @JsonProperty("connected_persons") List<String> connectedPersons,
        @JsonProperty("connected_objects") List<String> connectedObjects,
        @JsonProperty("sources") List<SourceCreateDto> sources,
        @JsonProperty("files") List<InfographicFileDto> files,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("sort_order") Integer sortOrder
) {}
