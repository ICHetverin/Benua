package com.benua.backend.service;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.dto.BuildingTypeUpdateDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Description;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BuildingServiceTest {

    @Mock
    private BuildingRepository buildingRepository;

    @Mock
    private ConnectionService connectionService;

    @Mock
    private MongoTemplate mongoTemplate;

    @Mock
    private ObjectTypeService objectTypeService;

    @InjectMocks
    private BuildingService buildingService;

    @Test
    void getBuildingReturnsEntityWhenItExists() {
        Building building = building("building-1", "Main House");
        when(buildingRepository.findById("building-1")).thenReturn(Optional.of(building));

        Building result = buildingService.getBuilding("building-1");

        assertSame(building, result);
    }

    @Test
    void getBuildingThrowsWhenEntityDoesNotExist() {
        when(buildingRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> buildingService.getBuilding("missing"));
    }

    @Test
    void createBuildingResolvesConnectionsAndMapsSavedEntityToDto() {
        Person connectedPerson = person("person-1", "Alice");
        Building connectedObject = building("building-2", "Gallery");
        Building savedBuilding = new Building(
                "building-1",
                "Museum",
                "Central street",
                55.75f,
                37.61f,
                "Architect",
                "1900",
                "History",
                "Design",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                "1",
                "Школы и гимназии",
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of()
        );

        BuildingCreateDto createDto = new BuildingCreateDto(
                null,
                "Museum",
                "Central street",
                55.75f,
                37.61f,
                "Architect",
                "1900",
                "History",
                "Design",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                "1",
                "Школы и гимназии",
                List.of("person-1"),
                List.of("building-2"),
                List.of(),
                List.of()
        );

        when(connectionService.getPersonsByIds(List.of("person-1"))).thenReturn(List.of(connectedPerson));
        when(connectionService.getBuildingsByIds(List.of("building-2"))).thenReturn(List.of(connectedObject));
        when(objectTypeService.validateAssignment("1", "Школы и гимназии"))
                .thenReturn(new ObjectTypeService.ObjectTypeAssignment("1", "Школы и гимназии"));
        when(buildingRepository.save(any(Building.class))).thenReturn(savedBuilding);

        BuildingDto result = buildingService.createBuilding(createDto);

        assertEquals("building-1", result._id());
        assertEquals("Museum", result.name());
        assertEquals("1", result.typeId());
        assertEquals("Школы и гимназии", result.subtype());
        assertEquals(1, result.connectedPersons().size());
        assertEquals("person-1", result.connectedPersons().getFirst()._id());
        assertEquals(1, result.connectedObjects().size());
        assertEquals("building-2", result.connectedObjects().getFirst()._id());
        verify(connectionService).getPersonsByIds(List.of("person-1"));
        verify(connectionService).getBuildingsByIds(List.of("building-2"));
        verify(buildingRepository).save(any(Building.class));
    }

    @Test
    void createBuildingSupportsEmptyConnections() {
        Building savedBuilding = building("building-1", "Museum");
        BuildingCreateDto createDto = new BuildingCreateDto(
                null,
                "Museum",
                "Central street",
                55.75f,
                37.61f,
                null,
                null,
                null,
                null,
                null,
                List.of(),
                List.of(),
                null,
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );

        when(connectionService.getPersonsByIds(List.of())).thenReturn(List.of());
        when(connectionService.getBuildingsByIds(List.of())).thenReturn(List.of());
        when(objectTypeService.validateAssignment(null, null))
                .thenReturn(new ObjectTypeService.ObjectTypeAssignment(null, null));
        when(buildingRepository.save(any(Building.class))).thenReturn(savedBuilding);

        BuildingDto result = buildingService.createBuilding(createDto);

        assertEquals("building-1", result._id());
        assertEquals(List.of(), result.connectedPersons());
        assertEquals(List.of(), result.connectedObjects());
    }

    @Test
    void getBuildingsDtoUsesFiltersAndPaginationFromRequest() {
        Building building = building("building-1", "Museum");
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Building.class))).thenReturn(List.of(building));

        List<BuildingDto> result = buildingService.getBuildingsDto(Map.of("name", "Museum"), 2, 5);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Building.class));
        Query query = queryCaptor.getValue();
        Document queryObject = query.getQueryObject();

        assertEquals(1, result.size());
        assertEquals("building-1", result.getFirst()._id());
        assertEquals("Museum", queryObject.getString("name"));
        assertEquals(10L, query.getSkip());
        assertEquals(5, query.getLimit());
    }

    @Test
    void getBuildingsDtoNormalizesInvalidPaginationValues() {
        Building building = building("building-1", "Museum");
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Building.class))).thenReturn(List.of(building));

        buildingService.getBuildingsDto(Map.of(), -1, 20_000);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Building.class));
        Query query = queryCaptor.getValue();

        assertEquals(0L, query.getSkip());
        assertEquals(10, query.getLimit());
    }

    @Test
    void toDtoReturnsMinimalConnectedEntities() {
        Person connectedPerson = person("person-1", "Alice");
        Building connectedObject = building("building-2", "Gallery");
        Building building = new Building(
                "building-1",
                "Museum",
                "Central street",
                55.75f,
                37.61f,
                "Architect",
                "1900",
                "History",
                "Design",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                "1",
                "Школы и гимназии",
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of()
        );

        BuildingDto result = buildingService.toDto(building);

        assertEquals("building-1", result._id());
        assertEquals("Museum", result.name());
        assertEquals("1", result.typeId());
        assertEquals("Школы и гимназии", result.subtype());
        assertEquals("person-1", result.connectedPersons().getFirst()._id());
        assertEquals("Alice", result.connectedPersons().getFirst().name());
        assertEquals("building-2", result.connectedObjects().getFirst()._id());
        assertEquals("Gallery", result.connectedObjects().getFirst().name());
    }

    @Test
    void updateBuildingTypeValidatesAssignmentAndKeepsOtherFields() {
        Building existing = building("building-1", "Museum");
        Building saved = new Building(
                "building-1",
                "Museum",
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
                "1",
                "Школы и гимназии",
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
        ArgumentCaptor<Building> buildingCaptor = ArgumentCaptor.forClass(Building.class);

        when(buildingRepository.findById("building-1")).thenReturn(Optional.of(existing));
        when(objectTypeService.validateAssignment("1", "Школы и гимназии"))
                .thenReturn(new ObjectTypeService.ObjectTypeAssignment("1", "Школы и гимназии"));
        when(buildingRepository.save(any(Building.class))).thenReturn(saved);

        BuildingDto result = buildingService.updateBuildingType(
                "building-1",
                new BuildingTypeUpdateDto("1", "Школы и гимназии")
        );

        verify(buildingRepository).save(buildingCaptor.capture());
        Building savedArgument = buildingCaptor.getValue();
        assertEquals("building-1", savedArgument._id());
        assertEquals("Museum", savedArgument.name());
        assertEquals("1", savedArgument.typeId());
        assertEquals("Школы и гимназии", savedArgument.subtype());
        assertEquals("1", result.typeId());
        assertEquals("Школы и гимназии", result.subtype());
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
                null,
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );
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
}
