package com.benua.backend.dto;

import com.benua.backend.model.Description;

import java.util.List;

/**
 * DTO для create Building
 * Сущность, принимаемая при Post
 * Создана для избегания циклов в JSON
 * связанные личности и объекты передаются как id
 * источники и изображения передаются как inline-данные и сохраняются сервисом
 */
public record BuildingCreateDto(
        String _id,
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
        String typeId,
        String subtype,
        List<String> connectedPersons,
        List<String> connectedObjects,
        List<SourceCreateDto> sources,
        List<ImageCreateDto> images
) {}
