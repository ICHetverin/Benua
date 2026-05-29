package com.benua.backend.controller;

import com.benua.backend.service.LocalStorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;

/**
 * Serves locally stored files at GET /files/**.
 * Handles HTTP Range requests (206 Partial Content) so browsers can seek audio/video.
 * Sets explicit Content-Type by extension so browsers recognise audio/mp4 (.m4a), etc.
 * Active only when LocalStorageService is used (app.s3.enabled=false).
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
    public ResponseEntity<?> serveFile(
            @RequestHeader HttpHeaders headers,
            HttpServletRequest request) throws IOException {

        // Strip context-path (/api) and /files/ prefix to get relative path
        String contextPath = request.getContextPath();
        String relativePath = request.getRequestURI()
                .substring(contextPath.length())
                .replaceFirst("^/files/", "");

        // Resolve path and guard against path-traversal
        Path filePath = localStorageService.getRootDir().resolve(relativePath).normalize();
        if (!filePath.startsWith(localStorageService.getRootDir())
                || !Files.exists(filePath)
                || Files.isDirectory(filePath)) {
            return ResponseEntity.notFound().build();
        }

        FileSystemResource resource = new FileSystemResource(filePath);
        MediaType mediaType = detectMediaType(filePath.getFileName().toString());
        long contentLength = resource.contentLength();

        List<HttpRange> ranges = headers.getRange();
        if (!ranges.isEmpty()) {
            HttpRange range = ranges.get(0);
            long start = range.getRangeStart(contentLength);
            long end   = range.getRangeEnd(contentLength);
            ResourceRegion region = new ResourceRegion(resource, start, end - start + 1);
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(mediaType)
                    .header(HttpHeaders.CONTENT_RANGE, "bytes " + start + "-" + end + "/" + contentLength)
                    .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                    .body(region);
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .contentLength(contentLength)
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(resource);
    }

    private static MediaType detectMediaType(String filename) {
        String ext = StringUtils.getFilenameExtension(filename);
        if (ext == null) return MediaType.APPLICATION_OCTET_STREAM;
        return switch (ext.toLowerCase(Locale.ROOT)) {
            case "m4a"         -> MediaType.parseMediaType("audio/mp4");
            case "mp3"         -> MediaType.parseMediaType("audio/mpeg");
            case "wav"         -> MediaType.parseMediaType("audio/wav");
            case "ogg"         -> MediaType.parseMediaType("audio/ogg");
            case "aac"         -> MediaType.parseMediaType("audio/aac");
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
            case "png"         -> MediaType.IMAGE_PNG;
            case "webp"        -> MediaType.parseMediaType("image/webp");
            default            -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
