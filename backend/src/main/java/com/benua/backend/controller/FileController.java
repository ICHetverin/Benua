package com.benua.backend.controller;

import com.benua.backend.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;

@RestController
@RequestMapping("/admin/files")
@PreAuthorize("hasRole('ADMIN')")
public class FileController {

    private final StorageService storageService;
    private final long presignedUrlTtlSeconds;

    public FileController(
            StorageService storageService,
            @Value("${app.s3.presigned-url-ttl-seconds:3600}") long presignedUrlTtlSeconds) {
        this.storageService = storageService;
        this.presignedUrlTtlSeconds = presignedUrlTtlSeconds;
    }

    record FileDto(String url, String key) {}

    record InfographicFileUploadDto(String url, String key, String type) {}

    @PostMapping(value = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public FileDto uploadAudio(@RequestPart("file") MultipartFile file) {
        StorageService.UploadedObject uploaded = storageService.uploadAudio(file);
        return new FileDto(uploaded.publicUrl(), uploaded.key());
    }

    @PostMapping(value = "/infographic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public InfographicFileUploadDto uploadInfographicFile(@RequestPart("file") MultipartFile file) {
        StorageService.UploadedObject uploaded = storageService.uploadInfographicFile(file);
        String contentType = file.getContentType();
        String type = "application/pdf".equals(contentType) ? "PDF" : "IMAGE";
        // Возвращаем presigned URL — сразу пригоден для отображения в adminке
        String presignedUrl = storageService.generatePresignedUrl(
                uploaded.key(), Duration.ofSeconds(presignedUrlTtlSeconds));
        return new InfographicFileUploadDto(presignedUrl, uploaded.key(), type);
    }
}
