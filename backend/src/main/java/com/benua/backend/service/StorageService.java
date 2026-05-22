package com.benua.backend.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    UploadedObject upload(MultipartFile file);
    void delete(String key);
    String publicUrl(String key);

    record UploadedObject(String key, String publicUrl) {}
}
