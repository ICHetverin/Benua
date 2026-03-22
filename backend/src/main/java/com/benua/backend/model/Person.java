package com.benua.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

/**
 * Сущность Person (Личность)
 *
 * @param _id уникальный идентификатор
 * @param name имя человека, обязательное, макс. 255 символов
 * @param lifeYears годы жизни (например, "1900-1970")
 * @param birthPlace место рождения, макс. 255 символов
 * @param profession профессия человека, макс. 255 символов
 * @param connectionWithBenua связь с Бенуа
 * @param description список описаний (topic : content) + валидация Description
 * @param interestingFacts список интересных фактов
 * @param sources список источников информации, lazy (Source manyToMany Person) + валидация Source
 * @param connectedPersons связанные личности (Person manyToMany Person) + валидация Person
 * @param connectedObjects связанные здания/объекты (Object manyToMany Person) + валидация Object
 * @param images список изображений, lazy (Image manyToMany Person) + валидация Image
 */
@Document(collection = "persons")
public record Person(
        @Id String _id,
        @NotBlank(message="Name is required") @Size(max=255, message = "Name too long (max=255)") String name,
        @Field("life_years") @Size(max=255, message="LifeYears too long (max=255)") String lifeYears,
        @Field("birth_place") @Size(max=255, message="LifeYears too long (max=255)") String birthPlace,
        @Size(max=255, message="Profession too long (max=255)") String profession,
        @Field("connection_with_benua") String connectionWithBenua,
        @Valid List<Description> description,
        @Field("interesting_facts") List<String> interestingFacts,

        @DBRef(lazy = true) @Valid List<Source> sources,
        @DBRef @Valid @Field("connected_persons") List<Person> connectedPersons,
        @DBRef @Valid @Field("connected_objects") List<Building> connectedObjects,
        @DBRef(lazy = true) @Valid List<Image> images
) {}