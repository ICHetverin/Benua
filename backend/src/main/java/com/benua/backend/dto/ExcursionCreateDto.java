package com.benua.backend.dto;

import com.benua.backend.model.Excursion;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ExcursionCreateDto(
        @NotBlank @Size(max = 255) String title,
        String description,
        Integer durationMinutes,
        @NotNull Excursion.Mode mode,
        String price,
        List<Excursion.ScheduleItem> schedule,
        List<Excursion.Waypoint> waypoints,
        List<String> buildings,
        String guideId,
        String coverImageId,
        List<String> imageIds,
        List<SourceCreateDto> sources,
        Integer sortOrder,
        Boolean isPublished
) {}
