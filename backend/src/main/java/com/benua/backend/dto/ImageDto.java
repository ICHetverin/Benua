package com.benua.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ImageDto(@JsonProperty("_id") String _id, String text, String urlToS3) {}
