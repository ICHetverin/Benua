package com.benua.backend.controller;

import com.benua.backend.dto.BuildingCreateDto;
import com.benua.backend.dto.BuildingDto;
import com.benua.backend.dto.BuildingUpdateDto;
import com.benua.backend.service.BuildingService;
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
@RequestMapping("/objects")
public class BuildingController {
    private final BuildingService bs;
    private static final Logger log = LoggerFactory.getLogger(BuildingController.class);

    public BuildingController(BuildingService bs) {
        this.bs = bs;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public BuildingDto createBuilding(@RequestBody @Valid BuildingCreateDto building) {
        log.info("createBuilding: {}", building.name());
        return bs.createBuilding(building);
    }

    @GetMapping
    public List<BuildingDto> getAllBuildings(
            @RequestParam Map<String, String> allParams,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        allParams.remove("page");
        allParams.remove("size");
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        log.info("getAllBuildings: filters={}, page={}, size={}, onlyPublished={}", allParams, page, size, onlyPublished);
        return bs.getBuildingsDto(allParams, page, size, onlyPublished);
    }

    @GetMapping("/{id}")
    public BuildingDto getBuildingById(@PathVariable String id) {
        log.info("getBuildingById: id={}", id);
        return bs.toDto(bs.getBuilding(id));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BuildingDto updateBuilding(@PathVariable String id, @RequestBody BuildingUpdateDto patch) {
        return bs.updateBuilding(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteBuilding(@PathVariable String id) {
        bs.deleteBuilding(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public BuildingDto setPublished(@PathVariable String id, @RequestParam boolean value) {
        return bs.setPublished(id, value);
    }

    @PostMapping("/reorder")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reorder(@RequestBody List<String> idsInOrder) {
        bs.reorder(idsInOrder);
    }
}
