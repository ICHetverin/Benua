package com.benua.backend.service;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
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

/**
 * Бизнес логика для работы API с Building
 */
@Service
public class BuildingService {
    private final BuildingRepository br;
    private final ConnectionService cs;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public BuildingService(BuildingRepository br, ConnectionService cs, MongoTemplate mongoTemplate) {
        this.br = br;
        this.cs = cs;
        this.mongoTemplate = mongoTemplate;
    }

    public Building getBuilding(String id) {
        return br.findById(id).orElseThrow(() -> new NoSuchElementException("Not found building by id: " + id));
    }

    private List<Building> getBuildings(Map<String, String> filters, int page, int size) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 100) size = 10;

        Query query = new Query();

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
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
                List.of(), // затычка sources
                connectedPeople,
                connectedBuildings,
                List.of() // затычка images
        );

        return toDto(br.save(newBuilding));
    }

    public BuildingDto toDto(Building b) {
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
                b.connectedPersons().stream()
                        .map(p -> new BuildingDto.SimpleEntity(p._id(), p.name()))
                        .toList(),
                b.connectedObjects().stream()
                        .map(o -> new BuildingDto.SimpleEntity(o._id(), o.name()))
                        .toList()
        );
    }

}