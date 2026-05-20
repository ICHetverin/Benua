package com.benua.backend.controller;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.dto.BuildingTypeUpdateDto;
import com.benua.backend.model.Building;
import com.benua.backend.service.BuildingService;
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
@RequestMapping("/objects")
public class BuildingController {
    private final BuildingService bs;
    private static final Logger log = LoggerFactory.getLogger(BuildingController.class);

    public BuildingController(BuildingService bs) {
        this.bs = bs;
    }

    @PostMapping
    public ResponseEntity<BuildingDto> createBuilding(@RequestBody @Valid BuildingCreateDto building) {
        log.info("Called createBuilding with payload={}", building);

        try {
            BuildingDto saved = bs.createBuilding(building);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved); // HTTP 201
        } catch (NoSuchElementException e) {
            log.error(e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            log.error("Error creating building with payload={}", building, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

    @GetMapping
    public ResponseEntity<List<BuildingDto>> getAllBuildings(
            @RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        allParams.remove("page");
        allParams.remove("size");

        log.info("Called getAllBuildings with filters={}, page={}, size={}", allParams, page, size);

        try {
            List<BuildingDto> result = bs.getBuildingsDto(allParams, page, size);
            log.info("getAllBuildings returned {} items for filters={}, page={}, size={}", result.size(), allParams, page, size);
            return ResponseEntity.ok(result); // HTTP 200, пустой список → []
        } catch (Exception e) {
            log.error("Error in getAllBuildings with filters={}, page={}, size={}", allParams, page, size, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BuildingDto> getBuildingById(@PathVariable @NotBlank String id) {
        log.info("Called getBuildingById: id={}", id);
        try {
            Building building = bs.getBuilding(id);
            log.info("Success getById");
            return ResponseEntity.ok(bs.toDto(building)); // HTTP 200
        } catch (NoSuchElementException e) {
            log.warn("No building found for id={}", id, e);
            return ResponseEntity.notFound().build(); // HTTP 404
        } catch (Exception e) {
            log.error("Error while getting building by id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // HTTP 500
        }
    }

    @PatchMapping("/{id}/type")
    public ResponseEntity<BuildingDto> updateBuildingType(
            @PathVariable @NotBlank String id,
            @RequestBody BuildingTypeUpdateDto dto) {
        log.info("Called updateBuildingType: id={}, payload={}", id, dto);

        try {
            return ResponseEntity.ok(bs.updateBuildingType(id, dto));
        } catch (NoSuchElementException e) {
            log.warn("No building found for id={}", id, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error while updating building type by id={}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
