package com.benua.backend.controller;

import com.benua.backend.model.ObjectType;
import com.benua.backend.service.ObjectTypeService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/object-types")
public class ObjectTypeController {
    private final ObjectTypeService objectTypeService;
    private static final Logger log = LoggerFactory.getLogger(ObjectTypeController.class);

    public ObjectTypeController(ObjectTypeService objectTypeService) {
        this.objectTypeService = objectTypeService;
    }

    @GetMapping
    public ResponseEntity<List<ObjectType>> getObjectTypes() {
        log.info("Called getObjectTypes");

        try {
            List<ObjectType> result = objectTypeService.getObjectTypes();
            log.info("getObjectTypes returned {} items", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error while getting object types", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObjectType> getObjectType(@PathVariable @NotBlank String id) {
        log.info("Called getObjectType: id={}", id);

        try {
            ObjectType result = objectTypeService.getObjectType(id);
            log.info("getObjectType succeeded: id={}", id);
            return ResponseEntity.ok(result);
        } catch (NoSuchElementException e) {
            log.warn("Object type not found: id={}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error while getting object type id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<ObjectType> createObjectType(@RequestBody @Valid ObjectType objectType) {
        log.info("Called createObjectType with payload={}", objectType);

        try {
            ObjectType created = objectTypeService.createObjectType(objectType);
            log.info("createObjectType succeeded: id={}", created._id());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            log.warn("Invalid createObjectType payload={}: {}", objectType, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error creating object type with payload={}", objectType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ObjectType> updateObjectType(
            @PathVariable @NotBlank String id,
            @RequestBody @Valid ObjectType objectType) {
        log.info("Called updateObjectType: id={}, payload={}", id, objectType);

        try {
            ObjectType updated = objectTypeService.updateObjectType(id, objectType);
            log.info("updateObjectType succeeded: id={}", updated._id());
            return ResponseEntity.ok(updated);
        } catch (NoSuchElementException e) {
            log.warn("Object type not found for update: id={}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalArgumentException e) {
            log.warn("Invalid updateObjectType payload for id={}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error updating object type id={} with payload={}", id, objectType, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ObjectType> deleteObjectType(@PathVariable @NotBlank String id) {
        log.info("Called deleteObjectType: id={}", id);

        try {
            objectTypeService.deleteObjectType(id);
            log.info("deleteObjectType succeeded: id={}", id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            log.warn("Object type not found for delete: id={}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error deleting object type id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
