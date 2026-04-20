package com.benua.backend.service;

import com.benua.backend.model.Image;
import com.benua.backend.model.Source;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.repository.SourceRepository;

import java.util.List;
import java.util.NoSuchElementException;

public class ValidationUtils {

    public static List<Image> validateImages(List<Image> images, ImageRepository imageRepository) {
        if (images == null) return List.of();
        return images.stream()
                .map(img -> imageRepository.findById(img._id())
                        .orElseThrow(() -> new NoSuchElementException(
                                "Image not found with id: " + img._id())))
                .toList();
    }

    public static List<Source> validateSources(List<Source> sources, SourceRepository sourceRepository) {
        if (sources == null) return List.of();
        return sources.stream()
                .map(img -> sourceRepository.findById(img._id())
                        .orElseThrow(() -> new NoSuchElementException(
                                "Source not found with id: " + img._id())))
                .toList();
    }

}