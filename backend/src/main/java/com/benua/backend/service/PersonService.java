package com.benua.backend.service;

import com.benua.backend.dto.*;
import com.benua.backend.model.Building;
import com.benua.backend.model.Image;
import com.benua.backend.model.Person;
import com.benua.backend.model.Source;
import com.benua.backend.repository.PersonRepository;
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
public class PersonService {
    private final PersonRepository pr;
    private final ConnectionService cs;
    private final MongoTemplate mongoTemplate;

    private final ImageService imageService;

    public PersonService(MongoTemplate mongoTemplate, PersonRepository pr, ConnectionService cs,
                         ImageService imageService) {
        this.mongoTemplate = mongoTemplate;
        this.pr = pr;
        this.cs = cs;
        this.imageService = imageService;
    }

    public Person getPerson(String id) {
        return pr.findById(id).orElseThrow(() -> new NoSuchElementException("Not found person by id: " + id));
    }

    private static final Set<String> ALLOWED_FILTERS = Set.of(
            "name", "life_years", "birth_place", "profession", "connection_with_benua"
    );

    public List<PersonDto> getPersonsDto(Map<String, String> filters, int page, int size, boolean onlyPublished) {
        if (page < 0) page = 0;
        if (size <= 0 || size > 10_000) size = 10;

        Query query = new Query();

        if (onlyPublished) {
            query.addCriteria(Criteria.where("is_published").is(true));
        }

        String search = filters.get("search");
        if (search != null && !search.isBlank()) {
            String pat = Pattern.quote(search);
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(pat, "i"),
                    Criteria.where("birth_place").regex(pat, "i")
            ));
        }

        String role = filters.get("role");
        if (role != null && !role.isBlank()) {
            query.addCriteria(Criteria.where("profession").regex(Pattern.quote(role), "i"));
        }

        String isPublishedParam = filters.get("is_published");
        if (!onlyPublished && isPublishedParam != null && !isPublishedParam.isBlank()) {
            query.addCriteria(Criteria.where("is_published").is(Boolean.parseBoolean(isPublishedParam)));
        }

        for (Map.Entry<String, String> entry : filters.entrySet()) {
            if (ALLOWED_FILTERS.contains(entry.getKey()) && entry.getValue() != null && !entry.getValue().isEmpty()) {
                query.addCriteria(Criteria.where(entry.getKey()).is(entry.getValue()));
            }
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "sort_order"));
        query.with(pageable);

        return mongoTemplate.find(query, Person.class).stream().map(this::toDto).toList();
    }

    public PersonDto createPerson(PersonCreateDto person, String updatedBy) {
        List<String> connectedPeople = person.connectedPersons() != null ? person.connectedPersons() : List.of();
        List<String> connectedBuildings = person.connectedObjects() != null ? person.connectedObjects() : List.of();
        // Prefer pre-uploaded imageIds (from /admin/images); fall back to inline ImageCreateDto
        List<Image> images = (person.imageIds() != null && !person.imageIds().isEmpty())
                ? cs.getImagesByIds(person.imageIds())
                : cs.saveImages(person.images());
        List<Source> sources = cs.saveSources(person.sources());

        Person newPerson = new Person(
                null, person.name(), person.lifeYears(), person.birthPlace(), person.profession(),
                person.connectionWithBenua(), person.description(), person.interestingFacts(),
                connectedPeople, connectedBuildings, images, sources,
                null, false, Instant.now(), Instant.now(), updatedBy,
                person.featuredImageId(), person.authors()
        );

        return toDto(pr.save(newPerson));
    }

    public PersonDto updatePerson(String id, PersonUpdateDto patch, String updatedBy) {
        Person existing = getPerson(id);

        List<String> connectedPeople = patch.connectedPersons() != null
                ? patch.connectedPersons() : existing.connectedPersons();
        List<String> connectedBuildings = patch.connectedObjects() != null
                ? patch.connectedObjects() : existing.connectedObjects();
        List<Image> images = patch.imageIds() != null
                ? cs.getImagesByIds(patch.imageIds()) : existing.images();
        List<Source> sources = patch.sources() != null
                ? cs.saveSources(patch.sources()) : existing.sources();

        Person updated = new Person(
                existing._id(),
                patch.name() != null ? patch.name() : existing.name(),
                patch.lifeYears() != null ? patch.lifeYears() : existing.lifeYears(),
                patch.birthPlace() != null ? patch.birthPlace() : existing.birthPlace(),
                patch.profession() != null ? patch.profession() : existing.profession(),
                patch.connectionWithBenua() != null ? patch.connectionWithBenua() : existing.connectionWithBenua(),
                patch.description() != null ? patch.description() : existing.description(),
                patch.interestingFacts() != null ? patch.interestingFacts() : existing.interestingFacts(),
                connectedPeople, connectedBuildings, images, sources,
                patch.sortOrder() != null ? patch.sortOrder() : existing.sortOrder(),
                patch.isPublished() != null ? patch.isPublished() : existing.isPublished(),
                existing.createdAt(), Instant.now(), updatedBy,
                patch.featuredImageId() != null ? patch.featuredImageId() : existing.featuredImageId(),
                patch.authors() != null ? patch.authors() : existing.authors()
        );

        return toDto(pr.save(updated));
    }

    public void deletePerson(String id) {
        getPerson(id);
        pr.deleteById(id);
    }

    public PersonDto setPublished(String id, boolean value, String updatedBy) {
        Person existing = getPerson(id);
        Person updated = new Person(
                existing._id(), existing.name(), existing.lifeYears(), existing.birthPlace(),
                existing.profession(), existing.connectionWithBenua(), existing.description(),
                existing.interestingFacts(), existing.connectedPersons(), existing.connectedObjects(),
                existing.images(), existing.sources(),
                existing.sortOrder(), value, existing.createdAt(), Instant.now(), updatedBy,
                existing.featuredImageId(), existing.authors()
        );
        return toDto(pr.save(updated));
    }

    public void reorder(List<String> idsInOrder) {
        if (idsInOrder == null || idsInOrder.isEmpty()) return;
        BulkOperations bulk = mongoTemplate.bulkOps(BulkOperations.BulkMode.UNORDERED, "persons");
        for (int i = 0; i < idsInOrder.size(); i++) {
            bulk.updateOne(
                    new Query(Criteria.where("_id").is(idsInOrder.get(i))),
                    new Update().set("sort_order", i).set("updated_at", Instant.now())
            );
        }
        bulk.execute();
    }

    public PersonDto toDto(Person p) {
        List<PersonDto.SimpleEntity> persons = p.connectedPersons() == null ? List.of() :
                cs.getPersonsByIds(p.connectedPersons()).stream()
                  .map(cp -> new PersonDto.SimpleEntity(cp._id(), cp.name())).toList();
        List<PersonDto.SimpleEntity> objects = p.connectedObjects() == null ? List.of() :
                cs.getBuildingsByIds(p.connectedObjects()).stream()
                  .map(o -> new PersonDto.SimpleEntity(o._id(), o.name())).toList();
        return new PersonDto(
                p._id(), p.name(), p.lifeYears(), p.birthPlace(), p.profession(), p.connectionWithBenua(),
                p.description(), p.interestingFacts(), persons, objects,
                imageService.toDtoList(p.images()), p.sources(),
                p.sortOrder(), p.isPublished(), p.createdAt(), p.updatedAt(),
                p.featuredImageId(), p.authors()
        );
    }
}
