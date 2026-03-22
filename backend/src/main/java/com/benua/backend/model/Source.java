package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Сущность Source
 *
 * @param _id уникальный идентификатор
 * @param text описание источника, макс. 500 символов
 * @param url ссылка на источник, макс. 2048 символов
 */
@Document(collection = "sources")
public record Source (
    @Id String _id,
    @NotBlank(message = "Text cannot be blank") @Size(max=500, message="Text too long (max=500)") String text,
    @NotBlank(message = "URL cannot be blank") @Size(max=2048, message="Url too long (max=2048") String url
) {}