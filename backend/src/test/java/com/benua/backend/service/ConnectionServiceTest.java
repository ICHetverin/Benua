package com.benua.backend.service;

import com.benua.backend.model.Building;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.PersonRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ConnectionServiceTest {

    @Mock
    private PersonRepository personRepository;

    @Mock
    private BuildingRepository buildingRepository;

    @InjectMocks
    private ConnectionService connectionService;

    @Test
    void getPersonsByIdsReturnsResolvedPersons() {
        Person alice = person("person-1", "Alice");
        Person bob = person("person-2", "Bob");
        when(personRepository.findById("person-1")).thenReturn(Optional.of(alice));
        when(personRepository.findById("person-2")).thenReturn(Optional.of(bob));

        List<Person> result = connectionService.getPersonsByIds(List.of("person-1", "person-2"));

        assertEquals(List.of(alice, bob), result);
    }

    @Test
    void getPersonsByIdsThrowsWhenOneIdIsMissing() {
        when(personRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> connectionService.getPersonsByIds(List.of("missing")));
    }

    @Test
    void getBuildingsByIdsReturnsResolvedBuildings() {
        Building museum = building("building-1", "Museum");
        Building gallery = building("building-2", "Gallery");
        when(buildingRepository.findById("building-1")).thenReturn(Optional.of(museum));
        when(buildingRepository.findById("building-2")).thenReturn(Optional.of(gallery));

        List<Building> result = connectionService.getBuildingsByIds(List.of("building-1", "building-2"));

        assertEquals(List.of(museum, gallery), result);
    }

    @Test
    void getBuildingsByIdsThrowsWhenOneIdIsMissing() {
        when(buildingRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> connectionService.getBuildingsByIds(List.of("missing")));
    }

    private static Person person(String id, String name) {
        return new Person(
                id,
                name,
                null,
                null,
                null,
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
    }

    private static Building building(String id, String name) {
        return new Building(
                id,
                name,
                "Address",
                55.75f,
                37.61f,
                null,
                null,
                null,
                null,
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
    }
}
