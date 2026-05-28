package com.benua.backend.controller;

import com.benua.backend.dto.InfographicCreateDto;
import com.benua.backend.dto.InfographicDto;
import com.benua.backend.dto.InfographicUpdateDto;
import com.benua.backend.service.InfographicService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/infographics")
public class InfographicController {

    private final InfographicService service;

    public InfographicController(InfographicService service) {
        this.service = service;
    }

    @GetMapping
    public List<InfographicDto> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "100") int size,
            Authentication auth) {
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        return service.list(page, size, onlyPublished);
    }

    @GetMapping("/{id}")
    public InfographicDto getById(@PathVariable String id) {
        return service.toDto(service.get(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public InfographicDto create(@RequestBody @Valid InfographicCreateDto dto, Authentication auth) {
        return service.create(dto, auth.getName());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public InfographicDto update(@PathVariable String id, @RequestBody InfographicUpdateDto dto, Authentication auth) {
        return service.update(id, dto, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public InfographicDto setPublished(@PathVariable String id, @RequestParam boolean value, Authentication auth) {
        return service.setPublished(id, value, auth.getName());
    }
}
