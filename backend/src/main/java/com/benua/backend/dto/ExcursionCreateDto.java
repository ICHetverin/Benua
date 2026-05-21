package com.benua.backend.dto;

import com.benua.backend.model.Excursion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExcursionCreateDto(
        @NotBlank @Size(max = 255) String name,
        String description,
        String time,
        String guide,
        List<String> passingMethods,
        List<String> keyPoints,
        List<Excursion.ContentSection> textContent,
        String coverPhoto,
        String routePhoto,
        List<Excursion.ExcursionSource> sources,
        Integer sortOrder,
        Boolean isPublished
) {}
