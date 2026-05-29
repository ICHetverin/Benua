package com.benua.backend.service;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@ConditionalOnMissingBean(YandexS3StorageService.class)
public class NoOpStorageService implements StorageService {

    @Override
    public UploadedObject upload(MultipartFile file) {
        throw new UnsupportedOperationException("Загрузка файлов недоступна: S3 не настроен");
    }

    @Override
    public UploadedObject uploadAudio(MultipartFile file) {
        throw new UnsupportedOperationException("Загрузка аудио недоступна: S3 не настроен");
    }

    @Override
    public void delete(String key) {
        // no-op: nothing to delete when S3 is not configured
    }

    @Override
    public String publicUrl(String key) {
        return key != null ? key : "";
    }

    @Override
    public String generatePresignedUrl(String s3Key, java.time.Duration duration) {
        // S3 не настроен — возвращаем ключ как есть (fallback)
        return s3Key != null ? s3Key : "";
    }
}
