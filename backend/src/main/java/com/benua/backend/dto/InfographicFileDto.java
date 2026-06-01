package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record InfographicFileDto(
        @JsonProperty("url") String url,
        @JsonProperty("key") String key,
        @JsonProperty("type") String type
) {}
