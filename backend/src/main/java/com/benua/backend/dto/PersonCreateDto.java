package com.benua.backend.dto;

import com.benua.backend.model.Description;
import com.benua.backend.model.Image;
import com.benua.backend.model.Source;

import java.util.List;

/**
 * DTO для create Person
 * Сущность, принимаемая при Post
 * Создана для избегания циклов в JSON
 * связанные личности, объекты, картинки, ресурсы передаются как id
 * внутри в service уже подтягиваются объекты по id
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
        List<Image> images,
        List<Source> sources
) {}