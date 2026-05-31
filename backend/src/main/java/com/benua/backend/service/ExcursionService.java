package com.benua.backend.service;

import com.benua.backend.dto.ExcursionCreateDto;
import com.benua.backend.dto.ExcursionDto;
import com.benua.backend.dto.ExcursionUpdateDto;
import com.benua.backend.model.Excursion;
import com.benua.backend.repository.ExcursionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
public class ExcursionService {

    private final ExcursionRepository excursionRepository;
    private final MongoTemplate mongoTemplate;
    private final StorageService storageService;
    private final String s3PublicBaseUrl;
    private final long presignedUrlTtlSeconds;

    public ExcursionService(
            ExcursionRepository excursionRepository,
            MongoTemplate mongoTemplate,
            StorageService storageService,
            @Value("${app.s3.public-base-url:}") String s3PublicBaseUrl,
            @Value("${app.s3.presigned-url-ttl-seconds:3600}") long presignedUrlTtlSeconds) {
        this.excursionRepository = excursionRepository;
        this.mongoTemplate = mongoTemplate;
        this.storageService = storageService;
        this.s3PublicBaseUrl = s3PublicBaseUrl.replaceAll("/+$", "");
        this.presignedUrlTtlSeconds = presignedUrlTtlSeconds;
    }

    /**
     * Генерирует свежий presigned URL из сохранённого audio URL.
     * Работает как с plain public URL, так и с уже истёкшим presigned URL в базе:
     * перед передачей ключа в S3 отбрасываем query-параметры (?X-Amz-...).
     * Для локального хранилища (s3PublicBaseUrl пустой) возвращает URL как есть.
     */
    private String presignAudio(String url) {
        if (url == null || url.isBlank() || s3PublicBaseUrl.isBlank()) return url;
        if (url.startsWith(s3PublicBaseUrl)) {
            String path = url.substring(s3PublicBaseUrl.length()).replaceAll("^/+", "");
            // Отрезаем query-параметры — они появляются, если в базе лежит старый presigned URL
            int queryIdx = path.indexOf('?');
            String key = queryIdx >= 0 ? path.substring(0, queryIdx) : path;
            return storageService.generatePresignedUrl(key, Duration.ofSeconds(presignedUrlTtlSeconds));
        }
        return url;
    }

    public Excursion getExcursion(String id) {
        return excursionRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Excursion not found: " + id));
    }

    public List<ExcursionDto> listExcursions(Map<String, String> filters, int page, int size, boolean onlyPublished) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 10_000) size = 10;

        Query query = new Query();
        if (onlyPublished) {
            query.addCriteria(Criteria.where("is_published").is(true));
        }

        String search = filters.get("search");
        if (search != null && !search.isBlank()) {
            query.addCriteria(Criteria.where("name").regex(Pattern.quote(search), "i"));
        }

        String isPublishedParam = filters.get("is_published");
        if (!onlyPublished && isPublishedParam != null && !isPublishedParam.isBlank()) {
            query.addCriteria(Criteria.where("is_published").is(Boolean.parseBoolean(isPublishedParam)));
        }

        query.with(PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sort_order")));
        return mongoTemplate.find(query, Excursion.class).stream().map(this::toDto).toList();
    }

    public ExcursionDto create(ExcursionCreateDto dto, String updatedBy) {
        Excursion excursion = new Excursion(
                null, dto.name(), dto.description(), dto.time(),
                dto.passingMethods(), dto.coverPhoto(), dto.routePhoto(), dto.sources(),
                dto.points(), dto.audioUrl(), dto.authors(),
                dto.isPublished() != null ? dto.isPublished() : false,
                dto.sortOrder(), Instant.now(), Instant.now(), updatedBy
        );
        return toDto(excursionRepository.save(excursion));
    }

    public ExcursionDto update(String id, ExcursionUpdateDto patch, String updatedBy) {
        Excursion existing = getExcursion(id);
        Excursion updated = new Excursion(
                existing._id(),
                patch.name() != null ? patch.name() : existing.name(),
                patch.description() != null ? patch.description() : existing.description(),
                patch.time() != null ? patch.time() : existing.time(),
                patch.passingMethods() != null ? patch.passingMethods() : existing.passingMethods(),
                patch.coverPhoto() != null ? patch.coverPhoto() : existing.coverPhoto(),
                patch.routePhoto() != null ? patch.routePhoto() : existing.routePhoto(),
                patch.sources() != null ? patch.sources() : existing.sources(),
                patch.points() != null ? patch.points() : existing.points(),
                patch.audioUrl() != null ? patch.audioUrl() : existing.audioUrl(),
                patch.authors() != null ? patch.authors() : existing.authors(),
                patch.isPublished() != null ? patch.isPublished() : existing.isPublished(),
                patch.sortOrder() != null ? patch.sortOrder() : existing.sortOrder(),
                existing.createdAt(), Instant.now(), updatedBy
        );
        return toDto(excursionRepository.save(updated));
    }

    public void delete(String id) {
        getExcursion(id);
        excursionRepository.deleteById(id);
    }

    public ExcursionDto setPublished(String id, boolean value, String updatedBy) {
        Excursion existing = getExcursion(id);
        Excursion updated = new Excursion(
                existing._id(), existing.name(), existing.description(), existing.time(),
                existing.passingMethods(), existing.coverPhoto(), existing.routePhoto(), existing.sources(),
                existing.points(), existing.audioUrl(), existing.authors(),
                value, existing.sortOrder(), existing.createdAt(), Instant.now(), updatedBy
        );
        return toDto(excursionRepository.save(updated));
    }

    public void reorder(List<String> idsInOrder) {
        if (idsInOrder == null || idsInOrder.isEmpty()) return;
        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, "excursions");
        for (int i = 0; i < idsInOrder.size(); i++) {
            bulk.updateOne(
                    new Query(Criteria.where("_id").is(idsInOrder.get(i))),
                    new Update().set("sort_order", i).set("updated_at", Instant.now())
            );
        }
        bulk.execute();
    }

    public ExcursionDto toDto(Excursion e) {
        List<Excursion.ExcursionPoint> points = e.points() == null ? null :
                e.points().stream().map(p -> new Excursion.ExcursionPoint(
                        p.address(), p.objectId(), p.description(), p.photoUrls(),
                        presignAudio(p.audioUrl()), p.lat(), p.lng()
                )).toList();
        return new ExcursionDto(
                e._id(), e.name(), e.description(), e.time(),
                e.passingMethods(), e.coverPhoto(), e.routePhoto(), e.sources(),
                points, presignAudio(e.audioUrl()), e.authors(),
                e.isPublished(), e.sortOrder(), e.createdAt(), e.updatedAt()
        );
    }
}
