package com.benua.backend.dto;

import com.benua.backend.model.Description;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record BuildingCreateDto(
        @JsonProperty("_id") String _id,
        @JsonProperty("name") String name,
        @JsonProperty("address") String address,
        @JsonProperty("latitude") Float latitude,
        @JsonProperty("longitude") Float longitude,
        @JsonProperty("architect") String architect,
        @JsonProperty("years_built") String yearsBuilt,
        @JsonProperty("history") String history,
        @JsonProperty("design") String design,
        @JsonProperty("connection_with_benua") String connectionWithBenua,
        @JsonProperty("description") List<Description> description,
        @JsonProperty("interesting_facts") List<String> interestingFacts,
        @JsonProperty("connected_persons") List<String> connectedPersons,
        @JsonProperty("connected_objects") List<String> connectedObjects,
        @JsonProperty("sources") List<SourceCreateDto> sources,
        @JsonProperty("images") List<ImageCreateDto> images
) {}
