package com.benua.backend.dto;

import com.benua.backend.model.Description;

import java.util.List;

public record PersonUpdateDto(
        String name,
        String lifeYears,
        String birthPlace,
        String profession,
        String connectionWithBenua,
        List<Description> description,
        List<String> interestingFacts,
        List<String> connectedPersons,
        List<String> connectedObjects,
        List<String> imageIds,
        List<SourceCreateDto> sources,
        Integer sortOrder,
        Boolean isPublished
) {}
