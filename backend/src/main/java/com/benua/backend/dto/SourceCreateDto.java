package com.benua.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SourceCreateDto(
    @NotBlank(message = "Source text cannot be blank") @Size(max = 500) String text,
    @NotBlank(message = "Source URL cannot be blank") @Size(max = 2048) String url
) {}
