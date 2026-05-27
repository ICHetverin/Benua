package com.benua.backend.controller;

import com.benua.backend.dto.BurialCreateDto;
import com.benua.backend.dto.BurialDto;
import com.benua.backend.dto.BurialUpdateDto;
import com.benua.backend.service.BurialService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/burials")
public class BurialController {

    private final BurialService burialService;

    public BurialController(BurialService burialService) {
        this.burialService = burialService;
    }

    @GetMapping
    public List<BurialDto> getAll(Authentication auth) {
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        return burialService.getAll(onlyPublished);
    }

    @GetMapping("/{id}")
    public BurialDto getById(@PathVariable String id) {
        return burialService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public BurialDto create(@RequestBody @Valid BurialCreateDto dto, Authentication auth) {
        return burialService.create(dto, auth.getName());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BurialDto update(@PathVariable String id, @RequestBody BurialUpdateDto dto, Authentication auth) {
        return burialService.update(id, dto, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        burialService.delete(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public BurialDto setPublished(@PathVariable String id, @RequestParam boolean value, Authentication auth) {
        return burialService.setPublished(id, value, auth.getName());
    }
}
