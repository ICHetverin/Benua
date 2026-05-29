package com.benua.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;
import java.util.List;

@Document(collection = "excursions")
public record Excursion(
        @Id String _id,
        String name,
        String description,
        String time,
        @Field("passing_methods") List<String> passingMethods,
        @Field("cover_photo") String coverPhoto,
        @Field("route_photo") String routePhoto,
        List<ExcursionSource> sources,
        List<ExcursionPoint> points,
        @Field("audio_url") String audioUrl,
        List<String> authors,
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy
) {
    public record ExcursionSource(String source, String url) {}
    public record ExcursionPoint(
            String address,
            @Field("object_id") String objectId,
            String description,
            @Field("photo_urls") List<String> photoUrls,
            @Field("audio_url") String audioUrl,
            Double lat,
            Double lng
    ) {}
}
