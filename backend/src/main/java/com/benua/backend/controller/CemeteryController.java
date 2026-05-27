package com.benua.backend.controller;

import com.benua.backend.dto.CemeteryCreateDto;
import com.benua.backend.dto.CemeteryDto;
import com.benua.backend.dto.CemeteryUpdateDto;
import com.benua.backend.service.CemeteryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cemeteries")
public class CemeteryController {

    private final CemeteryService cemeteryService;

    public CemeteryController(CemeteryService cemeteryService) {
        this.cemeteryService = cemeteryService;
    }

    @GetMapping
    public List<CemeteryDto> getAll(Authentication auth) {
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        return cemeteryService.getAll(onlyPublished);
    }

    @GetMapping("/{id}")
    public CemeteryDto getById(@PathVariable String id) {
        return cemeteryService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public CemeteryDto create(@RequestBody @Valid CemeteryCreateDto dto, Authentication auth) {
        return cemeteryService.create(dto, auth.getName());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public CemeteryDto update(@PathVariable String id, @RequestBody CemeteryUpdateDto dto, Authentication auth) {
        return cemeteryService.update(id, dto, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        cemeteryService.delete(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public CemeteryDto setPublished(@PathVariable String id, @RequestParam boolean value, Authentication auth) {
        return cemeteryService.setPublished(id, value, auth.getName());
    }
}
