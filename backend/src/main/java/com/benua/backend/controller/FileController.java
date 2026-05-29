package com.benua.backend.controller;

import com.benua.backend.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/admin/files")
@PreAuthorize("hasRole('ADMIN')")
public class FileController {

    private final StorageService storageService;

    public FileController(StorageService storageService) {
        this.storageService = storageService;
    }

    record FileDto(String url, String key) {}

    @PostMapping(value = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public FileDto uploadAudio(@RequestPart("file") MultipartFile file) {
        StorageService.UploadedObject uploaded = storageService.uploadAudio(file);
        return new FileDto(uploaded.publicUrl(), uploaded.key());
    }
}
