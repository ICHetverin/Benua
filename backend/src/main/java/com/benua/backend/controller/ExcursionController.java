package com.benua.backend.controller;

import com.benua.backend.dto.ExcursionCreateDto;
import com.benua.backend.dto.ExcursionDto;
import com.benua.backend.dto.ExcursionUpdateDto;
import com.benua.backend.service.ExcursionService;
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
@RequestMapping("/excursions")
public class ExcursionController {

    private final ExcursionService excursionService;
    private static final Logger log = LoggerFactory.getLogger(ExcursionController.class);

    public ExcursionController(ExcursionService excursionService) {
        this.excursionService = excursionService;
    }

    @GetMapping
    public List<ExcursionDto> list(
            @RequestParam Map<String, String> params,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        params.remove("page");
        params.remove("size");
        boolean onlyPublished = auth == null || !auth.isAuthenticated();
        return excursionService.listExcursions(params, page, size, onlyPublished);
    }

    @GetMapping("/{id}")
    public ExcursionDto getById(@PathVariable String id) {
        return excursionService.toDto(excursionService.getExcursion(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ExcursionDto create(@RequestBody @Valid ExcursionCreateDto dto, Authentication auth) {
        log.info("createExcursion: {}", dto.title());
        return excursionService.create(dto, auth.getName());
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ExcursionDto update(@PathVariable String id, @RequestBody ExcursionUpdateDto dto, Authentication auth) {
        return excursionService.update(id, dto, auth.getName());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable String id) {
        excursionService.delete(id);
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ExcursionDto setPublished(@PathVariable String id, @RequestParam boolean value, Authentication auth) {
        return excursionService.setPublished(id, value, auth.getName());
    }

    @PostMapping("/reorder")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void reorder(@RequestBody List<String> idsInOrder) {
        excursionService.reorder(idsInOrder);
    }
}
