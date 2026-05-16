package com.benua.backend.dto;

import com.benua.backend.model.Excursion;

import java.util.List;

public record ExcursionUpdateDto(
        String title,
        String description,
        Integer durationMinutes,
        Excursion.Mode mode,
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
