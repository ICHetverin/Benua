package com.benua.backend.service;

import com.benua.backend.model.ObjectType;
import com.benua.backend.repository.ObjectTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

@Service
public class ObjectTypeService {
    private final ObjectTypeRepository objectTypeRepository;

    public ObjectTypeService(ObjectTypeRepository objectTypeRepository) {
        this.objectTypeRepository = objectTypeRepository;
    }

    public List<ObjectType> getObjectTypes() {
        return objectTypeRepository.findAll().stream()
                .map(this::normalizeObjectType)
                .toList();
    }

    public ObjectType getObjectType(String id) {
        return normalizeObjectType(getObjectTypeEntity(id));
    }

    public ObjectType createObjectType(ObjectType objectType) {
        String id = normalizeNullable(objectType._id());
        if (id != null && objectTypeRepository.existsById(id)) {
            throw new IllegalArgumentException("Object type already exists: " + id);
        }

        ObjectType normalizedObjectType = new ObjectType(
                id,
                objectType.name().trim(),
                normalizeSubtypes(objectType.subtypes())
        );

        return normalizeObjectType(objectTypeRepository.save(normalizedObjectType));
    }

    public ObjectType updateObjectType(String id, ObjectType objectType) {
        ObjectType existing = getObjectTypeEntity(id);
        ObjectType updated = new ObjectType(
                existing._id(),
                objectType.name().trim(),
                normalizeSubtypes(objectType.subtypes())
        );

        return normalizeObjectType(objectTypeRepository.save(updated));
    }

    public void deleteObjectType(String id) {
        if (!objectTypeRepository.existsById(id)) {
            throw new NoSuchElementException("Object type not found by id: " + id);
        }
        objectTypeRepository.deleteById(id);
    }

    public ObjectTypeAssignment validateAssignment(String typeId, String subtype) {
        String normalizedTypeId = normalizeNullable(typeId);
        String normalizedSubtype = normalizeNullable(subtype);

        if (normalizedTypeId == null) {
            if (normalizedSubtype != null) {
                throw new IllegalArgumentException("Subtype cannot be set without type_id");
            }
            return new ObjectTypeAssignment(null, null);
        }

        ObjectType objectType = getObjectTypeEntity(normalizedTypeId);
        if (normalizedSubtype == null) {
            return new ObjectTypeAssignment(objectType._id(), null);
        }

        List<String> subtypes = normalizeSubtypes(objectType.subtypes());
        if (subtypes.isEmpty()) {
            throw new IllegalArgumentException("Object type has no subtypes: " + objectType._id());
        }
        if (!subtypes.contains(normalizedSubtype)) {
            throw new IllegalArgumentException("Subtype does not belong to type_id: " + objectType._id());
        }

        return new ObjectTypeAssignment(objectType._id(), normalizedSubtype);
    }

    public ObjectType normalizeObjectType(ObjectType objectType) {
        return new ObjectType(
                objectType._id(),
                objectType.name(),
                normalizeSubtypes(objectType.subtypes())
        );
    }

    private ObjectType getObjectTypeEntity(String id) {
        String normalizedId = normalizeNullable(id);
        if (normalizedId == null) {
            throw new NoSuchElementException("Object type id is required");
        }

        return objectTypeRepository.findById(normalizedId).orElseThrow(() -> new NoSuchElementException("Object type not found by id: " + normalizedId));
    }

    private List<String> normalizeSubtypes(List<String> subtypes) {
        if (subtypes == null || subtypes.isEmpty()) return List.of();

        return subtypes.stream()
                .map(this::normalizeNullable)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    private String normalizeNullable(String value) {
        if (value == null) return null;
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public record ObjectTypeAssignment(String typeId, String subtype) {}
}
