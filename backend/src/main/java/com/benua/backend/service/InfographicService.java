package com.benua.backend.service;

import com.benua.backend.dto.InfographicCreateDto;
import com.benua.backend.dto.InfographicDto;
import com.benua.backend.dto.InfographicFileDto;
import com.benua.backend.dto.InfographicUpdateDto;
import com.benua.backend.model.Infographic;
import com.benua.backend.model.InfographicFile;
import com.benua.backend.model.Source;
import com.benua.backend.repository.InfographicRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class InfographicService {

    private final InfographicRepository repository;
    private final ConnectionService cs;
    private final MongoTemplate mongoTemplate;
    private final StorageService storageService;
    private final long presignedUrlTtlSeconds;

    public InfographicService(
            InfographicRepository repository,
            ConnectionService cs,
            MongoTemplate mongoTemplate,
            StorageService storageService,
            @Value("${app.s3.presigned-url-ttl-seconds:3600}") long presignedUrlTtlSeconds) {
        this.repository = repository;
        this.cs = cs;
        this.mongoTemplate = mongoTemplate;
        this.storageService = storageService;
        this.presignedUrlTtlSeconds = presignedUrlTtlSeconds;
    }

    public Infographic get(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Infographic not found: " + id));
    }

    public List<InfographicDto> list(int page, int size, boolean onlyPublished) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 10_000) size = 20;

        Query query = new Query();
        if (onlyPublished) query.addCriteria(Criteria.where("is_published").is(true));
        query.with(PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sort_order")));

        return mongoTemplate.find(query, Infographic.class).stream().map(this::toDto).toList();
    }

    public InfographicDto create(InfographicCreateDto dto, String updatedBy) {
        List<Source> sources = cs.saveSources(dto.sources());
        List<InfographicFile> files = toModelFiles(dto.files());
        Infographic saved = repository.save(new Infographic(
                null, dto.name(), dto.description(),
                dto.authors(), dto.connectedPersons(), dto.connectedObjects(),
                sources, null, null, files,
                dto.isPublished() != null ? dto.isPublished() : false,
                dto.sortOrder(), Instant.now(), Instant.now(), updatedBy
        ));
        return toDto(saved);
    }

    public InfographicDto update(String id, InfographicUpdateDto patch, String updatedBy) {
        Infographic existing = get(id);
        List<Source> sources = patch.sources() != null ? cs.saveSources(patch.sources()) : existing.sources();
        List<InfographicFile> files = patch.files() != null ? toModelFiles(patch.files()) : existing.files();
        Infographic updated = repository.save(new Infographic(
                existing._id(),
                patch.name() != null ? patch.name() : existing.name(),
                patch.description() != null ? patch.description() : existing.description(),
                patch.authors() != null ? patch.authors() : existing.authors(),
                patch.connectedPersons() != null ? patch.connectedPersons() : existing.connectedPersons(),
                patch.connectedObjects() != null ? patch.connectedObjects() : existing.connectedObjects(),
                sources,
                existing.fileUrl(), existing.fileKey(), files,
                patch.isPublished() != null ? patch.isPublished() : existing.isPublished(),
                patch.sortOrder() != null ? patch.sortOrder() : existing.sortOrder(),
                existing.createdAt(), Instant.now(), updatedBy
        ));
        return toDto(updated);
    }

    public void delete(String id) {
        get(id);
        repository.deleteById(id);
    }

    public InfographicDto setPublished(String id, boolean value, String updatedBy) {
        Infographic existing = get(id);
        Infographic updated = repository.save(new Infographic(
                existing._id(), existing.name(), existing.description(),
                existing.authors(), existing.connectedPersons(), existing.connectedObjects(),
                existing.sources(), existing.fileUrl(), existing.fileKey(), existing.files(),
                value, existing.sortOrder(), existing.createdAt(), Instant.now(), updatedBy
        ));
        return toDto(updated);
    }

    public InfographicDto toDto(Infographic inf) {
        List<InfographicDto.SimpleEntity> persons = inf.connectedPersons() == null ? List.of() :
                cs.getPersonsByIds(inf.connectedPersons()).stream()
                  .map(p -> new InfographicDto.SimpleEntity(p._id(), p.name())).toList();
        List<InfographicDto.SimpleEntity> objects = inf.connectedObjects() == null ? List.of() :
                cs.getBuildingsByIds(inf.connectedObjects()).stream()
                  .map(o -> new InfographicDto.SimpleEntity(o._id(), o.name())).toList();

        List<InfographicFileDto> files;
        if (inf.files() != null && !inf.files().isEmpty()) {
            files = inf.files().stream()
                    .map(f -> new InfographicFileDto(presignedFileUrl(f.key(), f.url()), f.key(), f.type()))
                    .toList();
        } else if (inf.fileUrl() != null) {
            // Backward compat: old records with single file_url / file_key
            files = List.of(new InfographicFileDto(
                    presignedFileUrl(inf.fileKey(), inf.fileUrl()), inf.fileKey(), "IMAGE"));
        } else {
            files = List.of();
        }

        return new InfographicDto(
                inf._id(), inf.name(), inf.description(), inf.authors(),
                persons, objects, inf.sources(),
                files,
                inf.isPublished(), inf.sortOrder(),
                inf.createdAt(), inf.updatedAt()
        );
    }

    /**
     * Генерирует presigned URL если есть key, иначе возвращает сохранённый URL как есть.
     */
    private String presignedFileUrl(String key, String fallbackUrl) {
        if (key != null && !key.isBlank()) {
            return storageService.generatePresignedUrl(key, Duration.ofSeconds(presignedUrlTtlSeconds));
        }
        return fallbackUrl;
    }

    private List<InfographicFile> toModelFiles(List<InfographicFileDto> dtos) {
        if (dtos == null) return List.of();
        return dtos.stream()
                .map(d -> new InfographicFile(d.url(), d.key(), d.type()))
                .toList();
    }
}
