package com.benua.backend.dto;

import com.benua.backend.model.Excursion;
import com.benua.backend.model.Image;
import com.benua.backend.model.Source;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public record ExcursionDto(
        @JsonProperty("_id") String _id,
        String title,
        String description,
        Integer durationMinutes,
        String mode,
        String price,
        List<Excursion.ScheduleItem> schedule,
        List<Excursion.Waypoint> waypoints,
        List<SimpleEntity> buildings,
        SimpleEntity guide,
        Image coverImage,
        List<Image> images,
        List<Source> sources,
        Integer sortOrder,
        Boolean isPublished,
        Instant createdAt,
        Instant updatedAt
) {
    public record SimpleEntity(@JsonProperty("_id") String _id, String name) {}
}
