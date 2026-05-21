package com.benua.backend.dto;

import com.benua.backend.model.Excursion;

import java.util.List;

public record ExcursionUpdateDto(
        String name,
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
