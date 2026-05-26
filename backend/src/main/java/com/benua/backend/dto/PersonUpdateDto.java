package com.benua.backend.dto;

import com.benua.backend.model.Description;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record PersonUpdateDto(
        @JsonProperty("name") String name,
        @JsonProperty("life_years") String lifeYears,
        @JsonProperty("birth_place") String birthPlace,
        @JsonProperty("profession") String profession,
        @JsonProperty("connection_with_benua") String connectionWithBenua,
        @JsonProperty("description") List<Description> description,
        @JsonProperty("interesting_facts") List<String> interestingFacts,
        @JsonProperty("connected_persons") List<String> connectedPersons,
        @JsonProperty("connected_objects") List<String> connectedObjects,
        @JsonProperty("image_ids") List<String> imageIds,
        @JsonProperty("sources") List<SourceCreateDto> sources,
        @JsonProperty("sort_order") Integer sortOrder,
        @JsonProperty("is_published") Boolean isPublished,
        @JsonProperty("featured_image_id") String featuredImageId,
        @JsonProperty("authors") List<String> authors
) {}
