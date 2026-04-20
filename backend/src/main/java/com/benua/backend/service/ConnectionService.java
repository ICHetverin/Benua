package com.benua.backend.service;

import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.PersonRepository;
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


    public ConnectionService(PersonRepository personRepository, BuildingRepository buildingRepository) {
        this.personRepository = personRepository;
        this.buildingRepository = buildingRepository;
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
}