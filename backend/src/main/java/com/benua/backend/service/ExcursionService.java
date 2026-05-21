package com.benua.backend.service;

import com.benua.backend.dto.ExcursionCreateDto;
import com.benua.backend.dto.ExcursionDto;
import com.benua.backend.dto.ExcursionUpdateDto;
import com.benua.backend.model.*;
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
    private final ConnectionService cs;
    private final MongoTemplate mongoTemplate;

    public ExcursionService(ExcursionRepository excursionRepository, ConnectionService cs,
                            MongoTemplate mongoTemplate) {
        this.excursionRepository = excursionRepository;
        this.cs = cs;
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
            query.addCriteria(Criteria.where("title").regex(Pattern.quote(search), "i"));
        }

        String isPublishedParam = filters.get("is_published");
        if (!onlyPublished && isPublishedParam != null && !isPublishedParam.isBlank()) {
            query.addCriteria(Criteria.where("is_published").is(Boolean.parseBoolean(isPublishedParam)));
        }

        query.with(PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sort_order")));
        return mongoTemplate.find(query, Excursion.class).stream().map(this::toDto).toList();
    }

    public ExcursionDto create(ExcursionCreateDto dto, String updatedBy) {
        List<Building> buildings = cs.getBuildingsByIds(dto.buildings());
        Person guide = cs.getPersonById(dto.guideId());
        Image coverImage = cs.getImageById(dto.coverImageId());
        List<Image> images = dto.imageIds() != null ? cs.getImagesByIds(dto.imageIds()) : List.of();
        List<Source> sources = cs.saveSources(dto.sources());

        Excursion excursion = new Excursion(
                null, dto.title(), dto.description(), dto.durationMinutes(), dto.mode(),
                dto.price(), dto.schedule(), dto.waypoints(), buildings, guide, coverImage, images, sources,
                dto.sortOrder(), dto.isPublished() != null ? dto.isPublished() : false,
                Instant.now(), Instant.now(), updatedBy
        );
        return toDto(excursionRepository.save(excursion));
    }

    public ExcursionDto update(String id, ExcursionUpdateDto patch, String updatedBy) {
        Excursion existing = getExcursion(id);

        List<Building> buildings = patch.buildings() != null ? cs.getBuildingsByIds(patch.buildings()) : existing.buildings();
        Person guide = patch.guideId() != null ? cs.getPersonById(patch.guideId()) : existing.guide();
        Image coverImage = patch.coverImageId() != null ? cs.getImageById(patch.coverImageId()) : existing.coverImage();
        List<Image> images = patch.imageIds() != null ? cs.getImagesByIds(patch.imageIds()) : existing.images();
        List<Source> sources = patch.sources() != null ? cs.saveSources(patch.sources()) : existing.sources();

        Excursion updated = new Excursion(
                existing._id(),
                patch.title() != null ? patch.title() : existing.title(),
                patch.description() != null ? patch.description() : existing.description(),
                patch.durationMinutes() != null ? patch.durationMinutes() : existing.durationMinutes(),
                patch.mode() != null ? patch.mode() : existing.mode(),
                patch.price() != null ? patch.price() : existing.price(),
                patch.schedule() != null ? patch.schedule() : existing.schedule(),
                patch.waypoints() != null ? patch.waypoints() : existing.waypoints(),
                buildings, guide, coverImage, images, sources,
                patch.sortOrder() != null ? patch.sortOrder() : existing.sortOrder(),
                patch.isPublished() != null ? patch.isPublished() : existing.isPublished(),
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
                existing._id(), existing.title(), existing.description(), existing.durationMinutes(),
                existing.mode(), existing.price(), existing.schedule(), existing.waypoints(),
                existing.buildings(), existing.guide(), existing.coverImage(), existing.images(), existing.sources(),
                existing.sortOrder(), value, existing.createdAt(), Instant.now(), updatedBy
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
        List<ExcursionDto.SimpleEntity> buildings = e.buildings() == null ? List.of() :
                e.buildings().stream().map(b -> new ExcursionDto.SimpleEntity(b._id(), b.name())).toList();
        ExcursionDto.SimpleEntity guide = e.guide() == null ? null :
                new ExcursionDto.SimpleEntity(e.guide()._id(), e.guide().name());
        return new ExcursionDto(
                e._id(), e.title(), e.description(), e.durationMinutes(), e.mode() != null ? e.mode().name() : null,
                e.price(), e.schedule(), e.waypoints(), buildings, guide, e.coverImage(), e.images(), e.sources(),
                e.sortOrder(), e.isPublished(), e.createdAt(), e.updatedAt()
        );
    }
}
