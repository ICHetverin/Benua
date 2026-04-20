package com.benua.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record ImageCreateDto(
    @NotBlank(message = "Image text cannot be blank") String text,
    @Pattern(regexp = "^(https?|s3)://.+", message = "Must be a valid URL")
    @NotBlank(message = "Image URL cannot be blank") String urlToS3
) {}
