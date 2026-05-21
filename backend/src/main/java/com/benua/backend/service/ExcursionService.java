package com.benua.backend.service;

import com.benua.backend.dto.ExcursionCreateDto;
import com.benua.backend.dto.ExcursionDto;
import com.benua.backend.dto.ExcursionUpdateDto;
import com.benua.backend.model.Excursion;
import com.benua.backend.repository.ExcursionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.regex.Pattern;

@Service
public class ExcursionService {

    private final ExcursionRepository excursionRepository;
    private final MongoTemplate mongoTemplate;

    public ExcursionService(ExcursionRepository excursionRepository, MongoTemplate mongoTemplate) {
        this.excursionRepository = excursionRepository;
        this.mongoTemplate = mongoTemplate;
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
                null, dto.name(), dto.description(), dto.time(), dto.guide(),
                dto.passingMethods(), dto.keyPoints(), dto.textContent(),
                dto.coverPhoto(), dto.routePhoto(), dto.sources(),
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
                patch.guide() != null ? patch.guide() : existing.guide(),
                patch.passingMethods() != null ? patch.passingMethods() : existing.passingMethods(),
                patch.keyPoints() != null ? patch.keyPoints() : existing.keyPoints(),
                patch.textContent() != null ? patch.textContent() : existing.textContent(),
                patch.coverPhoto() != null ? patch.coverPhoto() : existing.coverPhoto(),
                patch.routePhoto() != null ? patch.routePhoto() : existing.routePhoto(),
                patch.sources() != null ? patch.sources() : existing.sources(),
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
                existing.guide(), existing.passingMethods(), existing.keyPoints(), existing.textContent(),
                existing.coverPhoto(), existing.routePhoto(), existing.sources(),
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
        return new ExcursionDto(
                e._id(), e.name(), e.description(), e.time(), e.guide(),
                e.passingMethods(), e.keyPoints(), e.textContent(),
                e.coverPhoto(), e.routePhoto(), e.sources(),
                e.isPublished(), e.sortOrder(), e.createdAt(), e.updatedAt()
        );
    }
}
