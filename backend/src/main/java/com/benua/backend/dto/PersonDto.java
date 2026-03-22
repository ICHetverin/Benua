package com.benua.backend.dto;

import com.benua.backend.model.Description;

import java.util.List;

/**
 * DTO для Person
 * Сущность, возвращаемая при GET {id}
 * Создана для избегания циклов в JSON
 * связанные личности и объекты передаются как минимальные сущности (Simple Entity)
 */
public record PersonDto(
        String _id,
        String name,
        String lifeYears,
        String birthPlace,
        String profession,
        String connectionWithBenua,
        List<Description> description,
        List<String> interestingFacts,
        List<SimpleEntity> connectedPersons,
        List<SimpleEntity> connectedObjects
) {
    /**
     * Минимальный объект для вложенных связей: только _id и name
     * @param _id уникальный идентификатор
     * @param name имя человека
     */
    public record SimpleEntity(String _id, String name) {}
}