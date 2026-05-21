package com.benua.backend.controller;

import com.benua.backend.dto.PublicExcursionDto;
import com.benua.backend.service.PublicExcursionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/public-excursions")
public class PublicExcursionController {

    private final PublicExcursionService service;

    public PublicExcursionController(PublicExcursionService service) {
        this.service = service;
    }

    @GetMapping
    public List<PublicExcursionDto> list() {
        return service.listPublished();
    }

    @GetMapping("/{id}")
    public PublicExcursionDto getById(@PathVariable String id) {
        return service.getById(id);
    }
}
