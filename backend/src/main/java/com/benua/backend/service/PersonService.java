package com.benua.backend.service;

import com.benua.backend.dto.PersonCreateDto;
import com.benua.backend.dto.PersonDto;
import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.model.Source;
import com.benua.backend.repository.ImageRepository;
import com.benua.backend.repository.PersonRepository;
import com.benua.backend.repository.SourceRepository;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

/**
 * Бизнес логика для работы API с Person
 */
@Service
public class PersonService {
    private final PersonRepository pr;
    private final ConnectionService cs;
    private final ImageRepository ir;
    private final SourceRepository sr;
    private final MongoTemplate mongoTemplate;

    @Autowired
    public PersonService(MongoTemplate mongoTemplate, PersonRepository pr, ConnectionService cs, ImageRepository ir, SourceRepository sr) {
        this.mongoTemplate = mongoTemplate;
        this.pr = pr;
        this.cs = cs;
        this.ir = ir;
        this.sr = sr;
    }

    public Person getPerson(@NotBlank String id) {
        return pr.findById(id).orElseThrow(() -> new NoSuchElementException("Not found person by id: " + id));
    }

    public List<Person> getPersons(Map<String, String> params, int offset, int limit) {
        Query query = new Query();

        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isEmpty()) {
                query.addCriteria(Criteria.where(entry.getKey()).is(entry.getValue()));
            }
        }

        query.skip(offset).limit(limit);

        return mongoTemplate.find(query, Person.class);
    }

    public List<PersonDto> getPersonsDto(Map<String, String> filters, int offset, int limit) {
        List<Person> persons = getPersons(filters, offset, limit);
        return persons.stream().map(this::toDto).toList();
    }

    public PersonDto createPerson(PersonCreateDto person) {
        List<Person> connectedPeople = cs.getPersonsByIds(person.connectedPersons());
        List<Building> connectedBuildings = cs.getBuildingsByIds(person.connectedObjects());

        List<Image> images = ValidationUtils.validateImages(person.images(), ir);
        List<Source> sources = ValidationUtils.validateSources(person.sources(), sr);

        Person newBuilding = new Person(
                null,
                person.name(),
                person.lifeYears(),
                person.birthPlace(),
                person.profession(),
                person.connectionWithBenua(),
                person.description(),
                person.interestingFacts(),
                connectedPeople,
                connectedBuildings,
                images,
                sources
        );

        return toDto(pr.save(newBuilding));
    }

    public List<PersonDto> getPersonDto(Map<String, String> filters, int offset, int limit) {
        List<Person> persons = getPersons(filters, offset, limit);
        return persons.stream().map(this::toDto).toList();
    }

    public PersonDto toDto(Person p) {
        return new PersonDto(
                p._id(),
                p.name(),
                p.lifeYears(),
                p.birthPlace(),
                p.profession(),
                p.connectionWithBenua(),
                p.description(),
                p.interestingFacts(),
                p.connectedPersons().stream()
                        .map(l -> new PersonDto.SimpleEntity(l._id(), l.name()))
                        .toList(),
                p.connectedObjects().stream()
                        .map(o -> new PersonDto.SimpleEntity(o._id(), o.name()))
                        .toList(),
                p.images(),
                p.sources()
        );
    }
}
