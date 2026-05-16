package com.benua.backend.controller;

import com.benua.backend.dto.PersonCreateDto;
import com.benua.backend.dto.PersonDto;
import com.benua.backend.dto.PersonUpdateDto;
import com.benua.backend.service.PersonService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/persons")
public class PersonController {
    private final PersonService ps;
    private static final Logger log = LoggerFactory.getLogger(PersonController.class);

    public PersonController(PersonService ps) {
        this.ps = ps;
    }

    @GetMapping
    public List<PersonDto> getAllPersons(
            @RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        allParams.remove("page");
        allParams.remove("size");
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        log.info("getAllPersons: filters={}, page={}, size={}, onlyPublished={}", allParams, page, size, onlyPublished);
        return ps.getPersonsDto(allParams, page, size, onlyPublished);
    }

    @GetMapping("/{id}")
    public PersonDto getPersonById(@PathVariable String id) {
        log.info("getPersonById: id={}", id);
        return ps.toDto(ps.getPerson(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public PersonDto createPerson(@RequestBody @Valid PersonCreateDto person) {
        log.info("createPerson: {}", person.name());
        return ps.createPerson(person);
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public PersonDto updatePerson(@PathVariable String id, @RequestBody PersonUpdateDto patch) {
        return ps.updatePerson(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePerson(@PathVariable String id) {
        ps.deletePerson(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public PersonDto setPublished(@PathVariable String id, @RequestParam boolean value) {
        return ps.setPublished(id, value);
    }

    @PostMapping("/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@RequestBody List<String> idsInOrder) {
        ps.reorder(idsInOrder);
    }
}
