package com.benua.backend.service;

import com.benua.backend.dto.CemeteryCreateDto;
import com.benua.backend.dto.CemeteryDto;
import com.benua.backend.dto.CemeteryUpdateDto;
import com.benua.backend.model.Cemetery;
import com.benua.backend.model.Image;
import com.benua.backend.repository.CemeteryRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CemeteryService {

    private final CemeteryRepository cemeteryRepository;
    private final ConnectionService connectionService;
    private final ImageService imageService;

    public CemeteryService(CemeteryRepository cemeteryRepository, ConnectionService connectionService,
                           ImageService imageService) {
        this.cemeteryRepository = cemeteryRepository;
        this.connectionService = connectionService;
        this.imageService = imageService;
    }

    public List<CemeteryDto> getAll(boolean onlyPublished) {
        List<Cemetery> list = onlyPublished
                ? cemeteryRepository.findByIsPublishedTrue()
                : cemeteryRepository.findAll();
        return list.stream().map(this::toDto).toList();
    }

    public CemeteryDto getById(String id) {
        return toDto(findById(id));
    }

    public CemeteryDto create(CemeteryCreateDto dto, String updatedBy) {
        List<Image> images = connectionService.getImagesByIds(
                dto.imageIds() != null ? dto.imageIds() : List.of());

        Cemetery cemetery = new Cemetery(
                null, dto.name(), dto.briefInfo(), images,
                false, null, Instant.now(), Instant.now(), updatedBy
        );
        return toDto(cemeteryRepository.save(cemetery));
    }

    public CemeteryDto update(String id, CemeteryUpdateDto dto, String updatedBy) {
        Cemetery existing = findById(id);

        List<Image> images = dto.imageIds() != null
                ? connectionService.getImagesByIds(dto.imageIds())
                : existing.images();

        Cemetery updated = new Cemetery(
                existing._id(),
                dto.name() != null ? dto.name() : existing.name(),
                dto.briefInfo() != null ? dto.briefInfo() : existing.briefInfo(),
                images,
                dto.isPublished() != null ? dto.isPublished() : existing.isPublished(),
                dto.sortOrder() != null ? dto.sortOrder() : existing.sortOrder(),
                existing.createdAt(), Instant.now(), updatedBy
        );
        return toDto(cemeteryRepository.save(updated));
    }

    public void delete(String id) {
        findById(id);
        cemeteryRepository.deleteById(id);
    }

    public CemeteryDto setPublished(String id, boolean value, String updatedBy) {
        Cemetery existing = findById(id);
        Cemetery updated = new Cemetery(
                existing._id(), existing.name(), existing.briefInfo(), existing.images(),
                value, existing.sortOrder(), existing.createdAt(), Instant.now(), updatedBy
        );
        return toDto(cemeteryRepository.save(updated));
    }

    public Cemetery findById(String id) {
        return cemeteryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Cemetery not found: " + id));
    }

    public CemeteryDto toDto(Cemetery c) {
        return new CemeteryDto(
                c._id(), c.name(), c.briefInfo(),
                imageService.toDtoList(c.images()),
                c.isPublished(), c.sortOrder(), c.createdAt(), c.updatedAt(), c.updatedBy()
        );
    }
}
