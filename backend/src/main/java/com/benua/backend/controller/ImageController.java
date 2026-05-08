package com.benua.backend.controller;

import com.benua.backend.dto.ImageDto;
import com.benua.backend.model.Image;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.service.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/admin/images")
@PreAuthorize("isAuthenticated()")
public class ImageController {

    private final StorageService storageService;
    private final ImageRepository imageRepository;

    public ImageController(StorageService storageService, ImageRepository imageRepository) {
        this.storageService = storageService;
        this.imageRepository = imageRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ImageDto upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(required = false) String text) {
        StorageService.UploadedObject uploaded = storageService.upload(file);
        String imageText = (text != null && !text.isBlank()) ? text : file.getOriginalFilename();
        Image saved = imageRepository.save(new Image(null, imageText, uploaded.publicUrl(), uploaded.key()));
        return new ImageDto(saved._id(), saved.text(), saved.urlToS3());
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
