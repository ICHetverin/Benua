package com.benua.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDate;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Dev-only: stores uploaded files on the local filesystem under {@code app.local-storage.path}.
 * Serves them via {@link LocalFileController} at {@code /files/**}.
 * Replace with {@link YandexS3StorageService} in production (set app.s3.enabled=true).
 */
@Service
@ConditionalOnProperty(name = "app.s3.enabled", havingValue = "false", matchIfMissing = true)
public class LocalStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(LocalStorageService.class);

    private static final Set<String> ALLOWED_IMAGE_MIMES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final Set<String> ALLOWED_AUDIO_MIMES = Set.of(
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/mp4", "audio/aac", "audio/x-m4a"
    );
    private static final Map<String, String> IMAGE_EXTENSIONS = Map.of(
            "image/jpeg", "jpg",
            "image/png", "png",
            "image/webp", "webp"
    );
    private static final Map<String, String> AUDIO_EXTENSIONS = Map.of(
            "audio/mpeg", "mp3",
            "audio/wav", "wav",
            "audio/ogg", "ogg",
            "audio/mp4", "m4a",
            "audio/aac", "aac",
            "audio/x-m4a", "m4a"
    );

    private final Path rootDir;
    private final String publicBaseUrl;

    public LocalStorageService(
            @Value("${app.local-storage.path:./local-uploads}") String storagePath,
            @Value("${app.local-storage.public-base-url:http://localhost:8080/api/files}") String publicBaseUrl) {
        this.rootDir = Paths.get(storagePath).toAbsolutePath().normalize();
        this.publicBaseUrl = publicBaseUrl.stripTrailing("/");
        try {
            Files.createDirectories(this.rootDir);
        } catch (IOException e) {
            throw new RuntimeException("Cannot create local upload directory: " + this.rootDir, e);
        }
        log.info("LocalStorageService: storing files at {}", this.rootDir);
    }

    @Override
    public UploadedObject upload(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_MIMES.contains(contentType.trim())) {
            throw new IllegalArgumentException("Недопустимый тип файла: " + contentType);
        }
        String ext = IMAGE_EXTENSIONS.getOrDefault(contentType.trim(), "bin");
        return store(file, "images", ext);
    }

    @Override
    public UploadedObject uploadAudio(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_AUDIO_MIMES.contains(contentType.trim())) {
            throw new IllegalArgumentException("Недопустимый тип аудиофайла: " + contentType);
        }
        String ext = AUDIO_EXTENSIONS.getOrDefault(contentType.trim(), "bin");
        return store(file, "audio", ext);
    }

    @Override
    public void delete(String key) {
        if (key == null || key.isBlank()) return;
        try {
            Files.deleteIfExists(rootDir.resolve(key));
        } catch (IOException e) {
            log.warn("Could not delete local file: {}", key, e);
        }
    }

    @Override
    public String publicUrl(String key) {
        return publicBaseUrl + "/" + key;
    }

    @Override
    public String generatePresignedUrl(String s3Key, Duration duration) {
        return publicUrl(s3Key);
    }

    public Path getRootDir() {
        return rootDir;
    }

    private UploadedObject store(MultipartFile file, String subfolder, String ext) {
        LocalDate today = LocalDate.now();
        String key = String.format("%s/%d/%02d/%s.%s",
                subfolder, today.getYear(), today.getMonthValue(), UUID.randomUUID(), ext);
        Path dest = rootDir.resolve(key);
        try {
            Files.createDirectories(dest.getParent());
            Files.write(dest, file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Ошибка сохранения файла локально", e);
        }
        String url = publicUrl(key);
        log.info("Stored file locally: key={}, url={}", key, url);
        return new UploadedObject(key, url);
    }
}
