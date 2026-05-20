package com.benua.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

/**
 * Сущность Building (Объект/Здание)
 *
 * @param _id уникальный идентификатор
 * @param name название здания, обязательное, макс 255 символов
 * @param address адрес здания, обязательное, макс 255 символов
 * @param latitude географическая широта, обязательное, (-40...70)
 * @param longitude географическая долгота, обязательное, (-20...40)
 * @param architect архитектор, макс 255 символов
 * @param yearsBuilt годы постройки, макс 255 символов
 * @param history история здания
 * @param design описание дизайна
 * @param connectionWithBenua связь с Бенуа
 * @param description список описаний (topic : content) + валидация Description
 * @param interestingFacts список интересных фактов
 * @param typeId идентификатор типа объекта
 * @param subtype подтип объекта
 * @param connectedPersons связанные лица, (Person manyToMany Object) + валидация Person
 * @param connectedObjects (Object manyToMany Object) + валидация Object
 * @param images картинки, lazy (Image manyToMany Object) + валидация Image
 * @param sources источники информации, lazy (Source manyToMany Object) + валидация Source
 */
@Document(collection = "objects")
public record Building(
        @Id String _id,
        @NotBlank(message="Name is required") @Size(max=255, message="Name too long (max=255)") String name,
        @NotBlank(message="Adress is required") @Size(max=255, message="Adress too long (max=255)") String address,
        @NotNull(message="Latitude is required") @Min(40) @Max(70) Float latitude,
        @NotNull(message="Longitude is required") @Min(20) @Max(40) Float longitude,
        @Size(max=255, message="Architect too long (max=255)") String architect,
        @Size(max=255, message="YearsBuilt too long (max=255)") @Field("years_built") String yearsBuilt,
        String history,
        String design,
        @Field("connection_with_benua") String connectionWithBenua,
        @Valid List<Description> description,
        @Field("interesting_facts") List<String> interestingFacts,
        @Field("type_id") String typeId,
        String subtype,
        @DBRef(lazy=true) @Valid @Field("connected_persons") List<Person> connectedPersons,
        @DBRef(lazy=true) @Valid @Field("connected_objects") List<Building> connectedObjects,
        @DBRef(lazy=true) @Valid List<Image> images,
        @DBRef(lazy=true) @Valid List<Source> sources
) {}
