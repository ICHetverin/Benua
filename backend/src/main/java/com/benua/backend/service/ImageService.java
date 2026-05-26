package com.benua.backend.service;

import com.benua.backend.dto.ImageDto;
import com.benua.backend.model.Image;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

/**
 * Конвертирует модель Image в ImageDto, подставляя presigned URL.
 * <p>
 * Если у Image есть s3Key — генерирует presigned URL через StorageService.
 * Если s3Key отсутствует (старые записи) — возвращает сохранённый urlToS3 как есть.
 */
@Service
public class ImageService {

    private final StorageService storageService;
    private final long presignedUrlTtlSeconds;

    public ImageService(
            StorageService storageService,
            @Value("${app.s3.presigned-url-ttl-seconds:3600}") long presignedUrlTtlSeconds) {
        this.storageService = storageService;
        this.presignedUrlTtlSeconds = presignedUrlTtlSeconds;
    }

    public ImageDto toDto(Image image) {
        if (image == null) return null;
        String url = (image.s3Key() != null && !image.s3Key().isBlank())
                ? storageService.generatePresignedUrl(image.s3Key(), Duration.ofSeconds(presignedUrlTtlSeconds))
                : image.urlToS3();
        return new ImageDto(image._id(), image.text(), url);
    }

    public List<ImageDto> toDtoList(List<Image> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream().map(this::toDto).toList();
    }
}
