package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.stereotype.Component;

/**
 * Сущность Description
 *
 * @param topic тема, макс. 255 символов
 * @param content подробное изложение по теме, макс 2000 символов
 */
public record Description (
    @NotBlank(message = "Topic cannot be blank") @Size(max=255, message="Text too long (max=255)") String topic,
    @NotBlank(message = "Content cannot be blank") @Size(max=2000, message="Content tpp long (max=2000)") String content
) {}