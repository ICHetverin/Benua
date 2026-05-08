package com.benua.backend.migration;

import com.benua.backend.model.*;
import com.benua.backend.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

/**
 * Сервис миграции данных из JSON-файлов в MongoDB.
 *
 * Двухпроходная загрузка:
 * 1) Сохраняем все сущности без связей (connectedPersons, connectedObjects)
 * 2) Обновляем связи, когда все сущности уже в базе
 *
 * Порядок загрузки: Image -> Source -> Person -> Building
 * Дубликаты пропускаются по _id.
 */
@Service
public class DataMigrationService {

    private static final Logger log = LoggerFactory.getLogger(DataMigrationService.class);

    private final ImageRepository imageRepository;
    private final SourceRepository sourceRepository;
    private final PersonRepository personRepository;
    private final BuildingRepository buildingRepository;
    private final ObjectMapper objectMapper;

    public DataMigrationService(ImageRepository imageRepository,
                                SourceRepository sourceRepository,
                                PersonRepository personRepository,
                                BuildingRepository buildingRepository,
                                ObjectMapper objectMapper) {
        this.imageRepository = imageRepository;
        this.sourceRepository = sourceRepository;
        this.personRepository = personRepository;
        this.buildingRepository = buildingRepository;
        this.objectMapper = objectMapper;
    }

    public void migrate() {
        log.info("Starting data migration...");

        migrateImages();
        migrateSources();

        List<PersonSeedDto> personDtos = readJson("data/persons.json", new TypeReference<>() {});
        List<BuildingSeedDto> buildingDtos = readJson("data/buildings.json", new TypeReference<>() {});

        savePersonsWithoutConnections(personDtos);
        saveBuildingsWithoutConnections(buildingDtos);

        updatePersonConnections(personDtos);
        updateBuildingConnections(buildingDtos);

        log.info("Data migration completed.");
    }

    private void migrateImages() {
        List<ImageSeedDto> images = readJson("data/images.json", new TypeReference<>() {});
        for (ImageSeedDto dto : images) {
            if (imageRepository.existsById(dto._id())) {
                log.warn("Image already exists, skipping: {}", dto._id());
                continue;
            }
            imageRepository.save(new Image(dto._id(), dto.text(), dto.url_to_s3(), null));
            log.info("Saved image: {}", dto._id());
        }
    }

    private record ImageSeedDto(String _id, String text, String url_to_s3) {}

    private void migrateSources() {
        List<Source> sources = readJson("data/sources.json", new TypeReference<>() {});
        for (Source source : sources) {
            if (sourceRepository.existsById(source._id())) {
                log.warn("Source already exists, skipping: {}", source._id());
                continue;
            }
            sourceRepository.save(source);
            log.info("Saved source: {}", source._id());
        }
    }

    private void savePersonsWithoutConnections(List<PersonSeedDto> dtos) {
        for (PersonSeedDto dto : dtos) {
            if (personRepository.existsById(dto.id())) {
                log.warn("Person already exists, skipping: {}", dto.id());
                continue;
            }
            try {
                personRepository.save(new Person(
                        dto.id(),
                        dto.name(),
                        dto.lifeYears(),
                        dto.birthPlace(),
                        dto.profession(),
                        dto.connectionWithBenua(),
                        dto.description(),
                        dto.interestingFacts(),
                        List.of(),
                        List.of(),
                        dto.images() != null ? dto.images() : List.of(),
                        dto.sources() != null ? dto.sources() : List.of(),
                        null, true, Instant.now(), Instant.now()
                ));
                log.info("Saved person (pass 1): {}", dto.id());
            } catch (Exception e) {
                log.error("Failed to save person {}: {}", dto.id(), e.getMessage());
            }
        }
    }

    private void saveBuildingsWithoutConnections(List<BuildingSeedDto> dtos) {
        for (BuildingSeedDto dto : dtos) {
            if (buildingRepository.existsById(dto.id())) {
                log.warn("Building already exists, skipping: {}", dto.id());
                continue;
            }
            try {
                buildingRepository.save(new Building(
                        dto.id(),
                        dto.name(),
                        dto.address(),
                        dto.latitude(),
                        dto.longitude(),
                        dto.architect(),
                        dto.yearsBuilt(),
                        dto.history(),
                        dto.design(),
                        dto.connectionWithBenua(),
                        dto.description(),
                        dto.interestingFacts(),
                        List.of(),
                        List.of(),
                        dto.images() != null ? dto.images() : List.of(),
                        dto.sources() != null ? dto.sources() : List.of(),
                        null, true, Instant.now(), Instant.now()
                ));
                log.info("Saved building (pass 1): {}", dto.id());
            } catch (Exception e) {
                log.error("Failed to save building {}: {}", dto.id(), e.getMessage());
            }
        }
    }

    private void updatePersonConnections(List<PersonSeedDto> dtos) {
        for (PersonSeedDto dto : dtos) {
            if (!hasConnections(dto.connectedPersons(), dto.connectedObjects())) continue;
            try {
                Person existing = personRepository.findById(dto.id())
                        .orElseThrow(() -> new IllegalArgumentException("Person not found: " + dto.id()));

                personRepository.save(new Person(
                        existing._id(),
                        existing.name(),
                        existing.lifeYears(),
                        existing.birthPlace(),
                        existing.profession(),
                        existing.connectionWithBenua(),
                        existing.description(),
                        existing.interestingFacts(),
                        resolvePersons(dto.connectedPersons()),
                        resolveBuildings(dto.connectedObjects()),
                        existing.images(),
                        existing.sources(),
                        existing.sortOrder(), existing.isPublished(), existing.createdAt(), Instant.now()
                ));
                log.info("Updated person connections: {}", dto.id());
            } catch (Exception e) {
                log.error("Failed to update person connections {}: {}", dto.id(), e.getMessage());
            }
        }
    }

    private void updateBuildingConnections(List<BuildingSeedDto> dtos) {
        for (BuildingSeedDto dto : dtos) {
            if (!hasConnections(dto.connectedPersons(), dto.connectedObjects())) continue;
            try {
                Building existing = buildingRepository.findById(dto.id())
                        .orElseThrow(() -> new IllegalArgumentException("Building not found: " + dto.id()));

                buildingRepository.save(new Building(
                        existing._id(),
                        existing.name(),
                        existing.address(),
                        existing.latitude(),
                        existing.longitude(),
                        existing.architect(),
                        existing.yearsBuilt(),
                        existing.history(),
                        existing.design(),
                        existing.connectionWithBenua(),
                        existing.description(),
                        existing.interestingFacts(),
                        resolvePersons(dto.connectedPersons()),
                        resolveBuildings(dto.connectedObjects()),
                        existing.images(),
                        existing.sources(),
                        existing.sortOrder(), existing.isPublished(), existing.createdAt(), Instant.now()
                ));
                log.info("Updated building connections: {}", dto.id());
            } catch (Exception e) {
                log.error("Failed to update building connections {}: {}", dto.id(), e.getMessage());
            }
        }
    }

    private boolean hasConnections(List<String> connectedPersons, List<String> connectedObjects) {
        return (connectedPersons != null && !connectedPersons.isEmpty())
                || (connectedObjects != null && !connectedObjects.isEmpty());
    }

    private List<Person> resolvePersons(List<String> ids) {
        if (ids == null) return List.of();
        return ids.stream()
                .map(id -> personRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Person not found: " + id)))
                .toList();
    }

    private List<Building> resolveBuildings(List<String> ids) {
        if (ids == null) return List.of();
        return ids.stream()
                .map(id -> buildingRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Building not found: " + id)))
                .toList();
    }

    private <T> List<T> readJson(String path, TypeReference<List<T>> typeRef) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            try (InputStream is = resource.getInputStream()) {
                return objectMapper.readValue(is, typeRef);
            }
        } catch (IOException e) {
            log.warn("JSON file not found or unreadable: {}. Skipping.", path);
            return List.of();
        }
    }
}
