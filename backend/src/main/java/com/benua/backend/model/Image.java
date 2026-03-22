package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Сущность Image
 *
 * @param _id уникальный идентификатор
 * @param text описание изображения
 * @param urlToS3 ссылка на изображения в хранилище S3
 */
@Document(collection = "images")
public record Image (
    @Id String _id,
    @NotBlank(message = "Text cannot be blank") String text,
    @NotBlank(message = "S3 URL cannot be blank") @Field("url_to_s3") String urlToS3
) {}