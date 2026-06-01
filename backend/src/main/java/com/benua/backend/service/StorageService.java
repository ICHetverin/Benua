package com.benua.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    UploadedObject upload(MultipartFile file);
    UploadedObject uploadAudio(MultipartFile file);
    UploadedObject uploadInfographicFile(MultipartFile file);
    void delete(String key);
    String publicUrl(String key);

    /**
     * Генерирует presigned URL для приватного доступа к объекту в S3.
     * При отключённом S3 (NoOp) возвращает переданный ключ как есть.
     */
    String generatePresignedUrl(String s3Key, java.time.Duration duration);

    record UploadedObject(String key, String publicUrl) {}
}
