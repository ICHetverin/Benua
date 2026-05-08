package com.benua.backend.dto;

import com.benua.backend.model.Description;

import java.util.List;

public record BuildingUpdateDto(
        String name,
        String address,
        Float latitude,
        Float longitude,
        String architect,
        String yearsBuilt,
        String history,
        String design,
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
