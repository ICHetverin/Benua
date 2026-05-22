package com.benua.backend.service;

import com.benua.backend.dto.PersonCreateDto;
import com.benua.backend.dto.PersonDto;
import com.benua.backend.dto.PersonUpdateDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Description;
import com.benua.backend.model.Person;
import com.benua.backend.repository.PersonRepository;
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
class PersonServiceTest {

    @Mock
    private PersonRepository personRepository;

    @Mock
    private ConnectionService connectionService;

    @Mock
    private MongoTemplate mongoTemplate;

    @InjectMocks
    private PersonService personService;

    @Test
    void getPersonReturnsEntityWhenItExists() {
        Person person = person("person-1", "Alice");
        when(personRepository.findById("person-1")).thenReturn(Optional.of(person));

        Person result = personService.getPerson("person-1");

        assertSame(person, result);
    }

    @Test
    void getPersonThrowsWhenEntityDoesNotExist() {
        when(personRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> personService.getPerson("missing"));
    }

    @Test
    void createPersonResolvesConnectionsAndMapsSavedEntityToDto() {
        Person connectedPerson = person("person-2", "Bob");
        Building connectedObject = building("building-1", "Museum");
        Person savedPerson = new Person(
                "person-1",
                "Alice",
                "1900-1970",
                "Paris",
                "Artist",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of(),
                null, false, null, null
        );

        PersonCreateDto createDto = new PersonCreateDto(
                null,
                "Alice",
                "1900-1970",
                "Paris",
                "Artist",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                List.of("person-2"),
                List.of("building-1"),
                List.of(),
                List.of()
        );

        when(connectionService.getPersonsByIds(List.of("person-2"))).thenReturn(List.of(connectedPerson));
        when(connectionService.getBuildingsByIds(List.of("building-1"))).thenReturn(List.of(connectedObject));
        when(personRepository.save(any(Person.class))).thenReturn(savedPerson);

        PersonDto result = personService.createPerson(createDto);

        assertEquals("person-1", result._id());
        assertEquals("Alice", result.name());
        assertEquals(1, result.connectedPersons().size());
        assertEquals("person-2", result.connectedPersons().getFirst()._id());
        assertEquals(1, result.connectedObjects().size());
        assertEquals("building-1", result.connectedObjects().getFirst()._id());
        verify(connectionService).getPersonsByIds(List.of("person-2"));
        verify(connectionService).getBuildingsByIds(List.of("building-1"));
        verify(personRepository).save(any(Person.class));
    }

    @Test
    void createPersonSupportsEmptyConnections() {
        Person savedPerson = person("person-1", "Alice");
        PersonCreateDto createDto = new PersonCreateDto(
                null,
                "Alice",
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
        when(personRepository.save(any(Person.class))).thenReturn(savedPerson);

        PersonDto result = personService.createPerson(createDto);

        assertEquals("person-1", result._id());
        assertEquals(List.of(), result.connectedPersons());
        assertEquals(List.of(), result.connectedObjects());
    }

    @Test
    void updatePersonMergesNonNullPatchFields() {
        Person existing = person("person-1", "Old Name");
        when(personRepository.findById("person-1")).thenReturn(Optional.of(existing));

        Person updated = person("person-1", "New Name");
        when(personRepository.save(any())).thenReturn(updated);

        PersonUpdateDto patch = new PersonUpdateDto(
                "New Name", null, null, null, null, null, null, null, null, null, null, null, null);

        PersonDto result = personService.updatePerson("person-1", patch);

        assertEquals("New Name", result.name());
        verify(personRepository).save(any(Person.class));
    }

    @Test
    void setPublishedUpdatesIsPublishedFlag() {
        Person existing = person("person-1", "Alice");
        when(personRepository.findById("person-1")).thenReturn(Optional.of(existing));

        Person published = new Person(
                "person-1", "Alice", null, null, null, null,
                List.of(), List.of(), List.of(), List.of(), List.of(), List.of(),
                null, true, null, null);
        when(personRepository.save(any())).thenReturn(published);

        PersonDto result = personService.setPublished("person-1", true);

        assertTrue(result.isPublished());
    }

    @Test
    void reorderExecutesBulkWrite() {
        BulkOperations bulk = mock(BulkOperations.class);
        when(mongoTemplate.bulkOps(any(), eq("persons"))).thenReturn(bulk);
        when(bulk.updateOne(any(), any())).thenReturn(bulk);

        personService.reorder(List.of("id-1", "id-2"));

        verify(bulk, times(2)).updateOne(any(), any());
        verify(bulk).execute();
    }

    @Test
    void getPersonsDtoUsesPageBasedPaginationAndFilters() {
        Person person = person("person-1", "Alice");
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Person.class))).thenReturn(List.of(person));

        List<PersonDto> result = personService.getPersonsDto(Map.of("name", "Alice"), 2, 3, false);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Person.class));
        Query query = queryCaptor.getValue();
        Document queryObject = query.getQueryObject();

        assertEquals(1, result.size());
        assertEquals("person-1", result.getFirst()._id());
        assertEquals("Alice", queryObject.getString("name"));
        assertEquals(6L, query.getSkip());  // page=2, size=3 → skip=6
        assertEquals(3, query.getLimit());
    }

    @Test
    void getPersonsDtoAddsIsPublishedFilterForAnonymous() {
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Person.class))).thenReturn(List.of());

        List<PersonDto> result = personService.getPersonsDto(Map.of(), 0, 10);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Person.class));
        Document queryObject = queryCaptor.getValue().getQueryObject();
        assertTrue(queryObject.containsKey("is_published"));
        assertEquals(true, queryObject.getBoolean("is_published"));
    }

    @Test
    void getPersonsDtoAppliesRoleFilter() {
        ArgumentCaptor<Query> queryCaptor = ArgumentCaptor.forClass(Query.class);
        when(mongoTemplate.find(any(Query.class), eq(Person.class))).thenReturn(List.of());

        personService.getPersonsDto(Map.of("role", "Artist"), 0, 10, false);

        verify(mongoTemplate).find(queryCaptor.capture(), eq(Person.class));
        assertTrue(queryCaptor.getValue().getQueryObject().containsKey("profession"));
    }

    @Test
    void toDtoReturnsMinimalConnectedEntities() {
        Person connectedPerson = person("person-2", "Bob");
        Building connectedObject = building("building-1", "Museum");
        Person person = new Person(
                "person-1",
                "Alice",
                "1900-1970",
                "Paris",
                "Artist",
                "Benua link",
                List.of(new Description("topic", "content")),
                List.of("fact"),
                List.of(connectedPerson),
                List.of(connectedObject),
                List.of(),
                List.of(),
                null, null, null, null
        );

        PersonDto result = personService.toDto(person);

        assertEquals("person-1", result._id());
        assertEquals("Alice", result.name());
        assertEquals("person-2", result.connectedPersons().getFirst()._id());
        assertEquals("Bob", result.connectedPersons().getFirst().name());
        assertEquals("building-1", result.connectedObjects().getFirst()._id());
        assertEquals("Museum", result.connectedObjects().getFirst().name());
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
}
