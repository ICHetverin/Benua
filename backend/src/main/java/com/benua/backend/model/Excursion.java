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
        String guide,
        @Field("passing_methods") List<String> passingMethods,
        @Field("key_points") List<String> keyPoints,
        @Field("text_content") List<ContentSection> textContent,
        @Field("cover_photo") String coverPhoto,
        @Field("route_photo") String routePhoto,
        List<ExcursionSource> sources,
        String type,
        List<ExcursionPoint> points,
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder,
        @Field("created_at") Instant createdAt,
        @Field("updated_at") Instant updatedAt,
        @Field("updated_by") String updatedBy
) {
    public record ContentSection(String topic, String content) {}
    public record ExcursionSource(String source, String url) {}
    public record ExcursionPoint(
            String address,
            @Field("object_id") String objectId,
            String description,
            @Field("photo_url") String photoUrl,
            @Field("audio_url") String audioUrl
    ) {}
}
