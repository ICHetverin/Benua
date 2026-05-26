package com.benua.backend.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

/**
 * Сущность Building (Объект/Здание)
 *
 * @param _id уникальный идентификатор
 * @param name название здания, обязательное, макс 255 символов
 * @param address адрес здания, обязательное, макс 255 символов
 * @param latitude географическая широта (опционально, не отображается в UI)
 * @param longitude географическая долгота (опционально, не отображается в UI)
 * @param architect архитектор, макс 255 символов
 * @param yearsBuilt годы постройки, макс 255 символов
 * @param history история здания
 * @param design описание дизайна
 * @param connectionWithBenua связь с Бенуа
 * @param description список описаний (topic : content) + валидация Description
 * @param interestingFacts список интересных фактов
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
        Float latitude,
        Float longitude,
        @Size(max=255, message="Architect too long (max=255)") String architect,
        @Size(max=255, message="YearsBuilt too long (max=255)") @Field("years_built") String yearsBuilt,
        String history,
        String design,
        @Field("connection_with_benua") String connectionWithBenua,
        @Valid List<Description> description,
        @Field("interesting_facts") List<String> interestingFacts,
        @Field("connected_persons") List<String> connectedPersons,
        @Field("connected_objects") List<String> connectedObjects,
        @DBRef @Valid List<Image> images,
        @DBRef @Valid List<Source> sources,
        @Field("building_type") String buildingType,
        @Field("building_subtype") String buildingSubtype,
        @Field("sort_order") Integer sortOrder,
        @Field("is_published") Boolean isPublished,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy,
        /** ID изображения, которое отображается первым / в превью карточки */
        @Field("featured_image_id") String featuredImageId,
        /** Авторы — кто выполнял поиск и отбор информации */
        @Field("authors") List<String> authors
) {}