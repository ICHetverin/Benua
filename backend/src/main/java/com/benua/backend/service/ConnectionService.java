package com.benua.backend.service;

import com.benua.backend.model.Building;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.PersonRepository;
import org.springframework.stereotype.Service;

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

    public List<Person> getPersonsByIds(List<String> ids) {
        return ids.stream()
                .map(id -> personRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Not found person by id: " + id)))
                .toList();
    }

    public List<Building> getBuildingsByIds(List<String> ids) {
        return ids.stream()
                .map(id -> buildingRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("Not found building by id: " + id)))
                .toList();
    }
}