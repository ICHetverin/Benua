package com.benua.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@ConditionalOnProperty(name = "app.s3.enabled", havingValue = "true")
public class YandexS3StorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(YandexS3StorageService.class);

    private final S3Client s3Client;
    private final String bucket;
    private final String publicBaseUrl;
    private final List<String> allowedMimes;

    public YandexS3StorageService(
            S3Client s3Client,
            @Value("${app.s3.bucket}") String bucket,
            @Value("${app.s3.public-base-url}") String publicBaseUrl,
            @Value("${app.uploads.allowed-mime}") String allowedMime) {
        this.s3Client = s3Client;
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl;
        this.allowedMimes = Arrays.asList(allowedMime.split(","));
    }

    @Override
    public UploadedObject upload(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !allowedMimes.contains(contentType.trim())) {
            throw new IllegalArgumentException("Недопустимый тип файла: " + contentType);
        }

        String ext = extensionForMime(contentType);
        LocalDate today = LocalDate.now();
        String key = String.format("images/%d/%02d/%s.%s", today.getYear(), today.getMonthValue(), UUID.randomUUID(), ext);

        try {
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(key)
                            .contentType(contentType)
                            .contentLength(file.getSize())
                            .build(),
                    RequestBody.fromBytes(file.getBytes())
            );
        } catch (IOException e) {
            throw new RuntimeException("Ошибка чтения файла при загрузке", e);
        }

        String url = publicUrl(key);
        log.info("Uploaded file to S3: key={}, url={}", key, url);
        return new UploadedObject(key, url);
    }

    @Override
    public void delete(String key) {
        if (key == null || key.isBlank()) return;
        s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(key).build());
        log.info("Deleted from S3: key={}", key);
    }

    @Override
    public String publicUrl(String key) {
        return publicBaseUrl + "/" + key;
    }

    private String extensionForMime(String mime) {
        return switch (mime.trim()) {
            case "image/jpeg" -> "jpg";
            case "image/png" -> "png";
            case "image/webp" -> "webp";
            default -> "bin";
        };
    }
}
