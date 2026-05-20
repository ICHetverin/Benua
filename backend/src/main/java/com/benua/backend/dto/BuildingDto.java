package com.benua.backend.dto;

import com.benua.backend.model.Description;
import com.benua.backend.model.Image;
import com.benua.backend.model.Source;

import java.util.List;

/**
 * DTO для Building
 * Сущность, возвращаемая при GET {id}
 * Создана для избегания циклов в JSON
 * связанные личности и объекты передаются как минимальные сущности (Simple Entity)
 */
public record BuildingDto(
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
        Boolean isBlue,
        List<SimpleEntity> connectedPersons,
        List<SimpleEntity> connectedObjects,
        List<Image> images,
        List<Source> sources
) {
    /**
     * Минимальный объект для вложенных связей: только _id и name
     * @param _id уникальный идентификатор
     * @param name название обьекта
     */
    public record SimpleEntity(String _id, String name) {}
}
