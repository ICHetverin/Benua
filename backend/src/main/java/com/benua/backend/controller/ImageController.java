package com.benua.backend.controller;

import com.benua.backend.dto.ImageDto;
import com.benua.backend.model.Image;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.service.ImageService;
import com.benua.backend.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/admin/images")
@PreAuthorize("hasRole('ADMIN')")
public class ImageController {

    private final StorageService storageService;
    private final ImageRepository imageRepository;
    private final ImageService imageService;

    public ImageController(StorageService storageService, ImageRepository imageRepository,
                           ImageService imageService) {
        this.storageService = storageService;
        this.imageRepository = imageRepository;
        this.imageService = imageService;
    }

    /** Загружает файл в S3 и возвращает ImageDto с presigned URL. */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImageDto upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String text) {
        StorageService.UploadedObject uploaded = storageService.upload(file);
        String imageText = (text != null && !text.isBlank()) ? text : file.getOriginalFilename();
        Image saved = imageRepository.save(new Image(null, imageText, uploaded.publicUrl(), uploaded.key()));
        return imageService.toDto(saved);
    }

    /** Переименовывает изображение (обновляет поле text). */
    @PatchMapping("/{id}")
    public ImageDto rename(@PathVariable String id, @RequestBody java.util.Map<String, String> body) {
        Image existing = imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found: " + id));
        String newText = body.getOrDefault("text", existing.text());
        Image updated = new Image(existing._id(), newText, existing.urlToS3(), existing.s3Key());
        return imageService.toDto(imageRepository.save(updated));
    }

    /** Возвращает свежий presigned URL для существующего изображения. */
    @GetMapping("/{id}/url")
    public ImageDto refreshUrl(@PathVariable String id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found: " + id));
        return imageService.toDto(image);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        Image image = imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found: " + id));
        storageService.delete(image.s3Key());
        imageRepository.deleteById(id);
    }
}
