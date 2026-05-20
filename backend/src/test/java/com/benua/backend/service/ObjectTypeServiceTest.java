package com.benua.backend.service;

import com.benua.backend.model.ObjectType;
import com.benua.backend.repository.ObjectTypeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ObjectTypeServiceTest {

    @Mock
    private ObjectTypeRepository objectTypeRepository;

    @InjectMocks
    private ObjectTypeService objectTypeService;

    @Test
    void getObjectTypesReturnsObjectTypes() {
        when(objectTypeRepository.findAll()).thenReturn(List.of(
                new ObjectType("1", "Учебные заведения", List.of("Школы и гимназии")),
                new ObjectType("2", "Жилые и доходные дома", List.of())
        ));

        List<ObjectType> result = objectTypeService.getObjectTypes();

        assertEquals(2, result.size());
        assertEquals("1", result.getFirst()._id());
        assertEquals("Учебные заведения", result.getFirst().name());
        assertEquals(List.of("Школы и гимназии"), result.getFirst().subtypes());
    }

    @Test
    void createObjectTypeNormalizesSubtypes() {
        ObjectType saved = new ObjectType("1", "Учебные заведения", List.of("Школы и гимназии"));
        when(objectTypeRepository.existsById("1")).thenReturn(false);
        when(objectTypeRepository.save(any(ObjectType.class))).thenReturn(saved);

        ObjectType result = objectTypeService.createObjectType(
                new ObjectType(" 1 ", " Учебные заведения ", List.of(" Школы и гимназии ", "", "Школы и гимназии"))
        );

        assertEquals("1", result._id());
        assertEquals(List.of("Школы и гимназии"), result.subtypes());
        verify(objectTypeRepository).save(new ObjectType("1", "Учебные заведения", List.of("Школы и гимназии")));
    }

    @Test
    void updateObjectTypeThrowsWhenTypeDoesNotExist() {
        when(objectTypeRepository.findById("missing")).thenReturn(Optional.empty());

        assertThrows(
                NoSuchElementException.class,
                () -> objectTypeService.updateObjectType("missing", new ObjectType(null, "Name", List.of()))
        );
    }

    @Test
    void validateAssignmentAllowsTypeWithNullSubtype() {
        when(objectTypeRepository.findById("1"))
                .thenReturn(Optional.of(new ObjectType("1", "Учебные заведения", List.of("Школы и гимназии"))));

        ObjectTypeService.ObjectTypeAssignment result = objectTypeService.validateAssignment("1", null);

        assertEquals("1", result.typeId());
        assertEquals(null, result.subtype());
    }

    @Test
    void validateAssignmentRejectsSubtypeWithoutType() {
        assertThrows(
                IllegalArgumentException.class,
                () -> objectTypeService.validateAssignment(null, "Школы и гимназии")
        );
    }

    @Test
    void validateAssignmentRejectsSubtypeFromAnotherType() {
        when(objectTypeRepository.findById("1"))
                .thenReturn(Optional.of(new ObjectType("1", "Учебные заведения", List.of("Школы и гимназии"))));

        assertThrows(
                IllegalArgumentException.class,
                () -> objectTypeService.validateAssignment("1", "Доходные дома")
        );
    }

    @Test
    void validateAssignmentRejectsSubtypeWhenTypeHasNoSubtypes() {
        when(objectTypeRepository.findById("2"))
                .thenReturn(Optional.of(new ObjectType("2", "Жилые и доходные дома", List.of())));

        assertThrows(
                IllegalArgumentException.class,
                () -> objectTypeService.validateAssignment("2", "Доходные дома")
        );
    }
}
