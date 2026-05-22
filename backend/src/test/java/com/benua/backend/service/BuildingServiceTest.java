package com.benua.backend.service;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.dto.BuildingUpdateDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Description;
import com.benua.backend.model.Person;
import com.benua.backend.repository.BuildingRepository;
import com.benua.backend.repository.ExcursionRepository;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.BulkOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BuildingServiceTest {

    @Mock
    private BuildingRepository buildingRepository;

    @Mock
    private ConnectionService connectionService;

    @Mock
    private ExcursionRepository excursionRepository;

    @Mock
    private MongoTemplate mongoTemplate;

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
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of(),
                null, false, null, null
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
                List.of("person-1"),
                List.of("building-2"),
                List.of(),
                List.of()
        );

        when(connectionService.getPersonsByIds(List.of("person-1"))).thenReturn(List.of(connectedPerson));
        when(connectionService.getBuildingsByIds(List.of("building-2"))).thenReturn(List.of(connectedObject));
        when(buildingRepository.save(any(Building.class))).thenReturn(savedBuilding);

        BuildingDto result = buildingService.createBuilding(createDto);

        assertEquals("building-1", result._id());
        assertEquals("Museum", result.name());
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
                List.of(),
                List.of(),
                List.of(),
                List.of()
        );

        when(connectionService.getPersonsByIds(List.of())).thenReturn(List.of());
        when(connectionService.getBuildingsByIds(List.of())).thenReturn(List.of());
        when(buildingRepository.save(any(Building.class))).thenReturn(savedBuilding);

        BuildingDto result = buildingService.createBuilding(createDto);

        assertEquals("building-1", result._id());
        assertEquals(List.of(), result.connectedPersons());
        assertEquals(List.of(), result.connectedObjects());
    }

    @Test
    void updateBuildingMergesNonNullPatchFields() {
        Building existing = building("building-1", "Old Name");
        when(buildingRepository.findById("building-1")).thenReturn(Optional.of(existing));

        Building updated = building("building-1", "New Name");
        when(buildingRepository.save(any())).thenReturn(updated);

        BuildingUpdateDto patch = new BuildingUpdateDto(
                "New Name", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);

        BuildingDto result = buildingService.updateBuilding("building-1", patch);

        assertEquals("New Name", result.name());
        verify(buildingRepository).save(any(Building.class));
    }

    @Test
    void setPublishedUpdatesIsPublishedFlag() {
        Building existing = building("building-1", "Museum");
        when(buildingRepository.findById("building-1")).thenReturn(Optional.of(existing));

        Building published = new Building(
                "building-1", "Museum", "Address", 55.75f, 37.61f,
                null, null, null, null, null,
                List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                null, true, null, null);
        when(buildingRepository.save(any())).thenReturn(published);

        BuildingDto result = buildingService.setPublished("building-1", true);

        assertTrue(result.isPublished());
    }

    @Test
    void reorderExecutesBulkWrite() {
        BulkOperations bulk = mock(BulkOperations.class);
        when(mongoTemplate.bulkOps(any(), eq("objects"))).thenReturn(bulk);
        when(bulk.updateOne(any(), any())).thenReturn(bulk);

        buildingService.reorder(List.of("id-1", "id-2", "id-3"));

        verify(bulk, times(3)).updateOne(any(), any());
        verify(bulk).execute();
    }

    @Test
    void getBuildingsDtoUsesFiltersAndPaginationFromRequest() {
        Building building = building("building-1", "Museum");
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Building.class))).thenReturn(List.of(building));

        List<BuildingDto> result = buildingService.getBuildingsDto(Map.of("name", "Museum"), 2, 5, false);

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
    void getBuildingsDtoAddsIsPublishedFilterForAnonymous() {
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Building.class))).thenReturn(List.of());

        buildingService.getBuildingsDto(Map.of(), 0, 10, true);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Building.class));
        Document queryObject = queryCaptor.getValue().getQueryObject();
        assertTrue(queryObject.containsKey("is_published"));
        assertEquals(true, queryObject.getBoolean("is_published"));
    }

    @Test
    void getBuildingsDtoNormalizesInvalidPaginationValues() {
        Building building = building("building-1", "Museum");
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Building.class))).thenReturn(List.of(building));

        buildingService.getBuildingsDto(Map.of(), -1, 200, false);

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
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of(),
                null, null, null, null
        );

        BuildingDto result = buildingService.toDto(building);

        assertEquals("building-1", result._id());
        assertEquals("Museum", result.name());
        assertEquals("person-1", result.connectedPersons().getFirst()._id());
        assertEquals("Alice", result.connectedPersons().getFirst().name());
        assertEquals("building-2", result.connectedObjects().getFirst()._id());
        assertEquals("Gallery", result.connectedObjects().getFirst().name());
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
                List.of(),
                null, null, null, null
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
                List.of(),
                null, null, null, null
        );
    }
}
