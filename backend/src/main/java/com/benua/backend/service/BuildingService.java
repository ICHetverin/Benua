package com.benua.backend.service;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingTypeUpdateDto;
import com.benua.backend.dto.ImageCreateDto;
import com.benua.backend.dto.SourceCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.model.Source;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.repository.SourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Set;

/**
 * Бизнес логика для работы API с Building
 */
@Service
public class BuildingService {
    private final BuildingRepository br;
    private final ConnectionService cs;
    private final ImageRepository ir;
    private final SourceRepository sr;
    private final MongoTemplate mongoTemplate;
    private final ObjectTypeService objectTypeService;

    @Autowired
    public BuildingService(BuildingRepository br, ConnectionService cs, ImageRepository ir, SourceRepository sr, MongoTemplate mongoTemplate, ObjectTypeService objectTypeService) {
        this.br = br;
        this.cs = cs;
        this.ir = ir;
        this.sr = sr;
        this.mongoTemplate = mongoTemplate;
        this.objectTypeService = objectTypeService;
    }

    public Building getBuilding(String id) {
        return br.findById(id).orElseThrow(() -> new NoSuchElementException("Not found building by id: " + id));
    }

    private static final Set<String> ALLOWED_FILTERS = Set.of(
            "name", "address", "architect", "years_built", "history", "design", "connection_with_benua", "type_id", "subtype", "is_blue"
    );

    private List<Building> getBuildings(Map<String, String> filters, int page, int size) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 10_000) size = 10;

        Query query = new Query();

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            if (ALLOWED_FILTERS.contains(entry.getKey()) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                query.addCriteria(Criteria.where(entry.getKey()).is(entry.getValue()));
            }
        }

        Pageable pageable = PageRequest.of(page, size);
        query.with(pageable);

        return mongoTemplate.find(query, Building.class);
    }

    public List<BuildingDto> getBuildingsDto(Map<String, String> filters, int page, int size) {
        List<Building> buildings = getBuildings(filters, page, size);
        return buildings.stream().map(this::toDto).toList();
    }

    public BuildingDto createBuilding(BuildingCreateDto building) {
        List<Person> connectedPeople = cs.getPersonsByIds(building.connectedPersons());
        List<Building> connectedBuildings = cs.getBuildingsByIds(building.connectedObjects());
        List<Image> images = saveImages(building.images());
        List<Source> sources = saveSources(building.sources());
        ObjectTypeService.ObjectTypeAssignment typeAssignment = objectTypeService.validateAssignment(building.typeId(), building.subtype());

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
                typeAssignment.typeId(),
                typeAssignment.subtype(),
                false,
                connectedPeople,
                connectedBuildings,
                images,
                sources
        );

        return toDto(br.save(newBuilding));
    }

    public BuildingDto updateBuildingType(String id, BuildingTypeUpdateDto dto) {
        Building existing = getBuilding(id);
        if (!Boolean.TRUE.equals(existing.isBlue())) {
            throw new IllegalArgumentException("Object type can be assigned only to blue objects");
        }
        ObjectTypeService.ObjectTypeAssignment typeAssignment = objectTypeService.validateAssignment(dto.typeId(), dto.subtype());

        Building updated = new Building(
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
                typeAssignment.typeId(),
                typeAssignment.subtype(),
                existing.isBlue(),
                existing.connectedPersons(),
                existing.connectedObjects(),
                existing.images(),
                existing.sources()
        );

        return toDto(br.save(updated));
    }

    public BuildingDto markBlue(String id) {
        Building existing = getBuilding(id);

        Building updated = new Building(
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
                existing.typeId(),
                existing.subtype(),
                true,
                existing.connectedPersons(),
                existing.connectedObjects(),
                existing.images(),
                existing.sources()
        );

        return toDto(br.save(updated));
    }

    public BuildingDto unmarkBlue(String id) {
        Building existing = getBuilding(id);

        Building updated = new Building(
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
                null,
                null,
                false,
                existing.connectedPersons(),
                existing.connectedObjects(),
                existing.images(),
                existing.sources()
        );

        return toDto(br.save(updated));
    }

    private List<Image> saveImages(List<ImageCreateDto> images) {
        if (images == null || images.isEmpty()) return List.of();
        return images.stream()
                .map(img -> ir.save(new Image(null, img.text(), img.urlToS3())))
                .toList();
    }

    private List<Source> saveSources(List<SourceCreateDto> sources) {
        if (sources == null || sources.isEmpty()) return List.of();
        return sources.stream()
                .map(src -> sr.save(new Source(null, src.text(), src.url())))
                .toList();
    }

    public BuildingDto toDto(Building b) {
        List<BuildingDto.SimpleEntity> persons = b.connectedPersons() == null ? List.of() :
                b.connectedPersons().stream()
                        .map(p -> new BuildingDto.SimpleEntity(p._id(), p.name()))
                        .toList();
        List<BuildingDto.SimpleEntity> objects = b.connectedObjects() == null ? List.of() :
                b.connectedObjects().stream()
                        .map(o -> new BuildingDto.SimpleEntity(o._id(), o.name()))
                        .toList();
        return new BuildingDto(
                b._id(),
                b.name(),
                b.address(),
                b.latitude(),
                b.longitude(),
                b.architect(),
                b.yearsBuilt(),
                b.history(),
                b.design(),
                b.connectionWithBenua(),
                b.description(),
                b.interestingFacts(),
                b.typeId(),
                b.subtype(),
                Boolean.TRUE.equals(b.isBlue()),
                persons,
                objects,
                b.images(),
                b.sources()
        );
    }

}
