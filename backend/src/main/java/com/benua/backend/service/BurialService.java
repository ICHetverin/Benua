package com.benua.backend.service;

import com.benua.backend.dto.BurialCreateDto;
import com.benua.backend.dto.BurialDto;
import com.benua.backend.dto.BurialUpdateDto;
import com.benua.backend.model.Burial;
import com.benua.backend.model.Image;
import com.benua.backend.repository.BurialRepository;
import com.benua.backend.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class BurialService {

    private final BurialRepository burialRepository;
    private final ConnectionService connectionService;
    private final ImageService imageService;
    private final PersonRepository personRepository;

    public BurialService(BurialRepository burialRepository, ConnectionService connectionService,
                         ImageService imageService, PersonRepository personRepository) {
        this.burialRepository = burialRepository;
        this.connectionService = connectionService;
        this.imageService = imageService;
        this.personRepository = personRepository;
    }

    public List<BurialDto> getAll(boolean onlyPublished) {
        List<Burial> burials = onlyPublished
                ? burialRepository.findByIsPublishedTrue()
                : burialRepository.findAll();
        return burials.stream().map(this::toDto).toList();
    }

    public BurialDto getById(String id) {
        return toDto(findById(id));
    }

    public BurialDto create(BurialCreateDto dto, String updatedBy) {
        List<Image> images = (dto.imageIds() != null && !dto.imageIds().isEmpty())
                ? connectionService.getImagesByIds(dto.imageIds())
                : connectionService.saveImages(dto.images());

        Burial burial = new Burial(
                null,
                dto.city(),
                dto.cemeteryName(),
                dto.name(),
                dto.lifeYears(),
                dto.briefInfo(),
                dto.connectedPersonId(),
                images,
                false,
                null,
                Instant.now(),
                Instant.now(),
                updatedBy
        );
        return toDto(burialRepository.save(burial));
    }

    public BurialDto update(String id, BurialUpdateDto dto, String updatedBy) {
        Burial existing = findById(id);

        List<Image> images = dto.imageIds() != null
                ? connectionService.getImagesByIds(dto.imageIds())
                : existing.images();

        Burial updated = new Burial(
                existing._id(),
                dto.city() != null ? dto.city() : existing.city(),
                dto.cemeteryName() == null ? existing.cemeteryName() : (dto.cemeteryName().isBlank() ? null : dto.cemeteryName()),
                dto.name() != null ? dto.name() : existing.name(),
                dto.lifeYears() != null ? dto.lifeYears() : existing.lifeYears(),
                dto.briefInfo() != null ? dto.briefInfo() : existing.briefInfo(),
                dto.connectedPersonId() == null ? existing.connectedPersonId() : (dto.connectedPersonId().isBlank() ? null : dto.connectedPersonId()),
                images,
                dto.isPublished() != null ? dto.isPublished() : existing.isPublished(),
                dto.sortOrder() != null ? dto.sortOrder() : existing.sortOrder(),
                existing.createdAt(),
                Instant.now(),
                updatedBy
        );
        return toDto(burialRepository.save(updated));
    }

    public void delete(String id) {
        findById(id);
        burialRepository.deleteById(id);
    }

    public BurialDto setPublished(String id, boolean value, String updatedBy) {
        Burial existing = findById(id);
        Burial updated = new Burial(
                existing._id(), existing.city(), existing.cemeteryName(), existing.name(),
                existing.lifeYears(), existing.briefInfo(), existing.connectedPersonId(),
                existing.images(), value, existing.sortOrder(),
                existing.createdAt(), Instant.now(), updatedBy
        );
        return toDto(burialRepository.save(updated));
    }

    private Burial findById(String id) {
        return burialRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Burial not found: " + id));
    }

    public BurialDto toDto(Burial b) {
        String personName = null;
        if (b.connectedPersonId() != null) {
            personName = personRepository.findById(b.connectedPersonId())
                    .map(p -> p.name())
                    .orElse(null);
        }
        return new BurialDto(
                b._id(), b.city(), b.cemeteryName(), b.name(), b.lifeYears(), b.briefInfo(),
                b.connectedPersonId(), personName,
                imageService.toDtoList(b.images()),
                b.isPublished(), b.sortOrder(), b.createdAt(), b.updatedAt(), b.updatedBy()
        );
    }
}
