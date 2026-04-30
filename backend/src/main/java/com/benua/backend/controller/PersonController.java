package com.benua.backend.controller;

import com.benua.backend.dto.PersonCreateDto;
import com.benua.backend.dto.PersonDto;
import com.benua.backend.model.Person;
import com.benua.backend.service.PersonService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/persons")
public class PersonController {
    private final PersonService ps;
    private static final Logger log = LoggerFactory.getLogger(PersonController.class);

    public PersonController(PersonService ps) {
        this.ps = ps;
    }

    @GetMapping()
    public ResponseEntity<List<PersonDto>> getAllPersons(@RequestParam Map<String, String> allParams,
                                                      @RequestParam(defaultValue = "0") int offset,
                                                      @RequestParam(defaultValue = "10") int limit) {
        allParams.remove("offset");
        allParams.remove("limit");

        try {
            List<PersonDto> result = ps.getPersonsDto(allParams, offset, limit);
            log.info("getAllPersons returned {} items for filters={}, offset={}, limit={}", result.size(), allParams, offset, limit);
            return ResponseEntity.ok(result); // HTTP 200, пустой список → []
        } catch (Exception e) {
            log.error("Error in getAllPersons with filters={}, offset={}, limit={}", allParams, offset, limit, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonDto> getPersonById(@PathVariable @NotBlank String id) {
        log.info("Called getPersonById: id={}", id);

        try {
            Person person = ps.getPerson(id);
            return ResponseEntity.ok(ps.toDto(person)); // HTTP 200
        } catch (NoSuchElementException e) {
            log.warn("No person found for id={}", id, e);
            return ResponseEntity.notFound().build(); // HTTP 404
        } catch (Exception e) {
            log.error("Error while getting person by id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

    @PostMapping
    public ResponseEntity<PersonDto> createPerson(@RequestBody @Valid PersonCreateDto person) {
        log.info("Called createPerson with payload={}", person);

        try {
            PersonDto saved = ps.createPerson(person);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved); // HTTP 201
        } catch (NoSuchElementException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error creating person with payload={}", person, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }
}
