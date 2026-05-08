package com.benua.backend.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.DayOfWeek;
import java.time.Instant;
import java.util.List;

@Document(collection = "excursions")
public record Excursion(
        @Id String _id,
        @NotBlank @Size(max = 255) String title,
        String description,
        @Field("duration_minutes") Integer durationMinutes,
        @NotNull Mode mode,
        String price,
        List<ScheduleItem> schedule,
        List<Waypoint> waypoints,
        @DBRef(lazy = true) List<Building> buildings,
        @DBRef(lazy = true) Person guide,
        @DBRef(lazy = true) @Field("cover_image") Image coverImage,
        @DBRef(lazy = true) List<Image> images,
        @DBRef(lazy = true) List<Source> sources,
        @Field("sort_order") Integer sortOrder,
        @Field("is_published") Boolean isPublished,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt
) {
    public enum Mode { PEDESTRIAN, BUS, MIXED }

    public record ScheduleItem(
            @NotNull DayOfWeek dayOfWeek,
            @NotBlank String time
    ) {}

    public record Waypoint(
            @NotNull Integer order,
            @NotNull Float lat,
            @NotNull Float lng,
            String buildingId
    ) {}
}
