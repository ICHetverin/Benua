package com.benua.backend.service;

import com.benua.backend.dto.*;
import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.model.Source;
import com.benua.backend.repository.BuildingRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class BuildingService {
    private final BuildingRepository br;
    private final ConnectionService cs;
    private final MongoTemplate mongoTemplate;
    private final ImageService imageService;

    public BuildingService(BuildingRepository br, ConnectionService cs, MongoTemplate mongoTemplate,
                           ImageService imageService) {
        this.br = br;
        this.cs = cs;
        this.mongoTemplate = mongoTemplate;
        this.imageService = imageService;
    }

    public Building getBuilding(String id) {
        return br.findById(id).orElseThrow(() -> new NoSuchElementException("Not found building by id: " + id));
    }

    private static final Set<String> ALLOWED_FILTERS = Set.of(
            "name", "address", "architect", "years_built", "history", "design", "connection_with_benua"
    );

    public List<BuildingDto> getBuildingsDto(Map<String, String> filters, int page, int size, boolean onlyPublished) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 10_000) size = 10;

        Query query = new Query();

        if (onlyPublished) {
            query.addCriteria(Criteria.where("is_published").is(true));
        }

        String search = filters.get("search");
        if (search != null && !search.isBlank()) {
            String pattern = Pattern.quote(search);
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(pattern, "i"),
                    Criteria.where("address").regex(pattern, "i")
            ));
        }

        String isPublishedParam = filters.get("is_published");
        if (!onlyPublished && isPublishedParam != null && !isPublishedParam.isBlank()) {
            query.addCriteria(Criteria.where("is_published").is(Boolean.parseBoolean(isPublishedParam)));
        }

        String personId = filters.get("person");
        if (personId != null && !personId.isBlank()) {
            query.addCriteria(Criteria.where("connected_persons").is(personId));
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            if (ALLOWED_FILTERS.contains(entry.getKey()) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                query.addCriteria(Criteria.where(entry.getKey()).is(entry.getValue()));
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sort_order"));
        query.with(pageable);

        return mongoTemplate.find(query, Building.class).stream().map(this::toDto).toList();
    }

    public BuildingDto createBuilding(BuildingCreateDto building, String updatedBy) {
        List<String> connectedPeople = building.connectedPersons() != null ? building.connectedPersons() : List.of();
        List<String> connectedBuildings = building.connectedObjects() != null ? building.connectedObjects() : List.of();
        // Prefer pre-uploaded imageIds (from /admin/images); fall back to inline ImageCreateDto
        List<Image> images = (building.imageIds() != null && !building.imageIds().isEmpty())
                ? cs.getImagesByIds(building.imageIds())
                : cs.saveImages(building.images());
        List<Source> sources = cs.saveSources(building.sources());

        Building newBuilding = new Building(
                null,
                building.name(),
                building.address(),
                building.latitude(),
                building.longitude(),
                building.architect(),
                building.yearsBuilt(),
                building.history(),
                building.design(),
                building.connectionWithBenua(),
                building.description(),
                building.interestingFacts(),
                connectedPeople,
                connectedBuildings,
                images,
                sources,
                building.buildingType(),
                building.buildingSubtype(),
                null,
                false,
                Instant.now(),
                Instant.now(),
                updatedBy,
                building.featuredImageId(),
                building.authors()
        );

        return toDto(br.save(newBuilding));
    }

    public BuildingDto updateBuilding(String id, BuildingUpdateDto patch, String updatedBy) {
        Building existing = getBuilding(id);

        List<String> connectedPeople = patch.connectedPersons() != null
                ? patch.connectedPersons() : existing.connectedPersons();
        List<String> connectedBuildings = patch.connectedObjects() != null
                ? patch.connectedObjects() : existing.connectedObjects();
        List<Image> images = patch.imageIds() != null
                ? cs.getImagesByIds(patch.imageIds()) : existing.images();
        List<Source> sources = patch.sources() != null
                ? cs.saveSources(patch.sources()) : existing.sources();

        Building updated = new Building(
                existing._id(),
                patch.name() != null ? patch.name() : existing.name(),
                patch.address() != null ? patch.address() : existing.address(),
                patch.latitude() != null ? patch.latitude() : existing.latitude(),
                patch.longitude() != null ? patch.longitude() : existing.longitude(),
                patch.architect() != null ? patch.architect() : existing.architect(),
                patch.yearsBuilt() != null ? patch.yearsBuilt() : existing.yearsBuilt(),
                patch.history() != null ? patch.history() : existing.history(),
                patch.design() != null ? patch.design() : existing.design(),
                patch.connectionWithBenua() != null ? patch.connectionWithBenua() : existing.connectionWithBenua(),
                patch.description() != null ? patch.description() : existing.description(),
                patch.interestingFacts() != null ? patch.interestingFacts() : existing.interestingFacts(),
                connectedPeople,
                connectedBuildings,
                images,
                sources,
                patch.buildingType() != null ? patch.buildingType() : existing.buildingType(),
                patch.buildingSubtype() != null ? patch.buildingSubtype() : existing.buildingSubtype(),
                patch.sortOrder() != null ? patch.sortOrder() : existing.sortOrder(),
                patch.isPublished() != null ? patch.isPublished() : existing.isPublished(),
                existing.createdAt(),
                Instant.now(),
                updatedBy,
                patch.featuredImageId() != null ? patch.featuredImageId() : existing.featuredImageId(),
                patch.authors() != null ? patch.authors() : existing.authors()
        );

        return toDto(br.save(updated));
    }

    public void deleteBuilding(String id) {
        getBuilding(id);
        br.deleteById(id);
    }

    public BuildingDto setPublished(String id, boolean value, String updatedBy) {
        Building existing = getBuilding(id);
        Building updated = new Building(
                existing._id(), existing.name(), existing.address(), existing.latitude(), existing.longitude(),
                existing.architect(), existing.yearsBuilt(), existing.history(), existing.design(),
                existing.connectionWithBenua(), existing.description(), existing.interestingFacts(),
                existing.connectedPersons(), existing.connectedObjects(), existing.images(), existing.sources(),
                existing.buildingType(), existing.buildingSubtype(),
                existing.sortOrder(), value, existing.createdAt(), Instant.now(), updatedBy,
                existing.featuredImageId(), existing.authors()
        );
        return toDto(br.save(updated));
    }

    public void reorder(List<String> idsInOrder) {
        if (idsInOrder == null || idsInOrder.isEmpty()) return;
        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, "objects");
        for (int i = 0; i < idsInOrder.size(); i++) {
            bulk.updateOne(
                    new Query(Criteria.where("_id").is(idsInOrder.get(i))),
                    new Update().set("sort_order", i).set("updated_at", Instant.now())
            );
        }
        bulk.execute();
    }

    public BuildingDto toDto(Building b) {
        List<BuildingDto.SimpleEntity> persons = b.connectedPersons() == null ? List.of() :
                cs.getPersonsByIds(b.connectedPersons()).stream()
                  .map(p -> new BuildingDto.SimpleEntity(p._id(), p.name())).toList();
        List<BuildingDto.SimpleEntity> objects = b.connectedObjects() == null ? List.of() :
                cs.getBuildingsByIds(b.connectedObjects()).stream()
                  .map(o -> new BuildingDto.SimpleEntity(o._id(), o.name())).toList();
        return new BuildingDto(
                b._id(), b.name(), b.address(), b.latitude(), b.longitude(),
                b.architect(), b.yearsBuilt(), b.history(), b.design(), b.connectionWithBenua(),
                b.description(), b.interestingFacts(), persons, objects,
                imageService.toDtoList(b.images()), b.sources(),
                b.buildingType(), b.buildingSubtype(),
                b.sortOrder(), b.isPublished(), b.createdAt(), b.updatedAt(),
                b.featuredImageId(), b.authors()
        );
    }
}
