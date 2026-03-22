package com.benua.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
 * @param latitude географическая широта, обязательное, (-90...90)
 * @param longitude географическая долгота, обязательное, (-90...90)
 * @param architect архитектор, макс 255 символов
 * @param yearsBuilt годы постройки, макс 255 символов
 * @param history история здания
 * @param design описание дизайна
 * @param connectionWithBenua связь с Бенуа
 * @param description список описаний (topic : content) + валидация Description
 * @param interestingFacts список интересных фактов
 * @param sources источники информации, lazy (Source manyToMany Object) + валидация Source
 * @param connectedPersons связанные лица, отсутствие сериализации (Person manyToMany Object) + валидация Person
 * @param connectedObjects (Object manyToMany Object) + валидация Object
 * @param images картинки, lazy (Image manyToMany Object) + валидация Image
 */
@Document(collection = "objects")
public record Building(
        @Id String _id,
        @NotBlank(message="Name is required") @Size(max=255, message="Name too long (max=255)") String name,
        @NotBlank(message="Adress is required") @Size(max=255, message="Adress too long (max=255)") String address,
        @NotBlank(message="Latitude is required") @Min(-90) @Max(90) Float latitude,
        @NotBlank(message="Longitude is required") @Min(-90) @Max(90) Float longitude,
        @Size(max=255, message="Architect too long (max=255)") String architect,
        @Size(max=255, message="YearsBuilt too long (max=255)") @Field("years_built") String yearsBuilt,
        String history,
        String design,
        @Field("connection_with_benua") String connectionWithBenua,
        @Valid List<Description> description,
        @Field("interesting_facts") List<String> interestingFacts,
        @DBRef(lazy=true) @Valid List<Source> sources,
        @JsonBackReference @DBRef @Valid @Field("connected_persons") List<Person> connectedPersons,
        @JsonBackReference @DBRef @Valid @Field("connected_objects") List<Building> connectedObjects,
        @DBRef(lazy=true) @Valid List<Image> images
) {}