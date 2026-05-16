package com.benua.backend.service;

import com.benua.backend.dto.ImageCreateDto;
import com.benua.backend.dto.SourceCreateDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.model.Source;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.repository.PersonRepository;
import com.benua.backend.repository.SourceRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Логика для устранения циклической связи BuildingService <-> PersonService в create
 * PersonRepository -> ConnectionService <- BuildingRepository
*/
@Service
public class ConnectionService {
    private final PersonRepository personRepository;
    private final BuildingRepository buildingRepository;
    private final ImageRepository imageRepository;
    private final SourceRepository sourceRepository;

    public ConnectionService(PersonRepository personRepository, BuildingRepository buildingRepository,
                             ImageRepository imageRepository, SourceRepository sourceRepository) {
        this.personRepository = personRepository;
        this.buildingRepository = buildingRepository;
        this.imageRepository = imageRepository;
        this.sourceRepository = sourceRepository;
    }

    private <T> List<T> getByIds(List<String> ids, MongoRepository<T, String> repository, String entityName) {
        if (ids == null || ids.isEmpty()) return Collections.emptyList();

        return ids.stream()
                .map(id -> repository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException(
                                entityName + " not found by id: " + id)))
                .toList();
    }

    public List<Person> getPersonsByIds(List<String> ids) {
        return getByIds(ids, personRepository, "person");
    }

    public List<Building> getBuildingsByIds(List<String> ids) {
        return getByIds(ids, buildingRepository, "building");
    }

    public List<Image> getImagesByIds(List<String> ids) {
        return getByIds(ids, imageRepository, "image");
    }

    public Person getPersonById(String id) {
        if (id == null || id.isBlank()) return null;
        return personRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Person not found by id: " + id));
    }

    public Image getImageById(String id) {
        if (id == null || id.isBlank()) return null;
        return imageRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Image not found by id: " + id));
    }

    public List<Image> saveImages(List<ImageCreateDto> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream()
                .map(img -> imageRepository.save(new Image(null, img.text(), img.urlToS3(), null)))
                .toList();
    }

    public List<Source> saveSources(List<SourceCreateDto> sources) {
        if (sources == null || sources.isEmpty()) return List.of();
        return sources.stream()
                .map(src -> sourceRepository.save(new Source(null, src.text(), src.url())))
                .toList();
    }
}