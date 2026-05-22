package com.benua.backend.service;

import com.benua.backend.dto.PublicExcursionDto;
import com.benua.backend.model.PublicExcursion;
import com.benua.backend.repository.PublicExcursionRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PublicExcursionService {

    private final PublicExcursionRepository repository;
    private final MongoTemplate mongoTemplate;

    public PublicExcursionService(PublicExcursionRepository repository, MongoTemplate mongoTemplate) {
        this.repository = repository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<PublicExcursionDto> listPublished() {
        Query query = new Query(Criteria.where("is_published").ne(false))
                .with(Sort.by(Sort.Direction.ASC, "sort_order"));
        return mongoTemplate.find(query, PublicExcursion.class).stream().map(this::toDto).toList();
    }

    public PublicExcursionDto getById(String id) {
        return repository.findById(id)
                .map(this::toDto)
                .orElseThrow(() -> new NoSuchElementException("PublicExcursion not found: " + id));
    }

    public PublicExcursionDto toDto(PublicExcursion e) {
        return new PublicExcursionDto(
                e._id(), e.name(), e.description(), e.time(), e.guide(),
                e.passingMethods(), e.keyPoints(), e.textContent(),
                e.coverPhoto(), e.routePhoto(), e.sources(),
                e.isPublished(), e.sortOrder()
        );
    }
}
