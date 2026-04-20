package com.benua.backend.dto;

import com.benua.backend.model.Description;

import java.util.List;

/**
 * DTO для create Person
 * Сущность, принимаемая при Post
 * Создана для избегания циклов в JSON
 * связанные личности и объекты передаются как id
 * источники и изображения передаются как inline-данные и сохраняются сервисом
 */
public record PersonCreateDto(
        String _id,
        String name,
        String lifeYears,
        String birthPlace,
        String profession,
        String connectionWithBenua,
        List<Description> description,
        List<String> interestingFacts,
        List<String> connectedPersons,
        List<String> connectedObjects,
        List<ImageCreateDto> images,
        List<SourceCreateDto> sources
) {}
