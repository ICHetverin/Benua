package com.benua.backend.controller;

import com.benua.backend.service.LocalStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;

/**
 * Serves locally stored files (active only when LocalStorageService is used, i.e. S3 is disabled).
 */
@RestController
@RequestMapping("/files")
@ConditionalOnBean(LocalStorageService.class)
public class LocalFileController {

    private final LocalStorageService localStorageService;

    public LocalFileController(LocalStorageService localStorageService) {
        this.localStorageService = localStorageService;
    }

    @GetMapping("/**")
    public ResponseEntity<Resource> serveFile(HttpServletRequest request) {
        String requestPath = request.getRequestURI();
        String contextPath = request.getContextPath(); // e.g. "/api"
        // Strip context-path prefix, then strip "/files/" prefix
        String relativePath = requestPath
                .substring(contextPath.length())
                .replaceFirst("^/files/", "");

        Path filePath = localStorageService.getRootDir().resolve(relativePath).normalize();

        // Security: ensure the resolved path is inside the root directory
        if (!filePath.startsWith(localStorageService.getRootDir())) {
            return ResponseEntity.badRequest().build();
        }

        if (!Files.exists(filePath)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(filePath);
        String contentType = detectContentType(filePath);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    private String detectContentType(Path path) {
        String name = path.getFileName().toString().toLowerCase();
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".webp")) return "image/webp";
        if (name.endsWith(".mp3")) return "audio/mpeg";
        if (name.endsWith(".wav")) return "audio/wav";
        if (name.endsWith(".ogg")) return "audio/ogg";
        if (name.endsWith(".m4a")) return "audio/mp4";
        if (name.endsWith(".aac")) return "audio/aac";
        return "application/octet-stream";
    }
}
