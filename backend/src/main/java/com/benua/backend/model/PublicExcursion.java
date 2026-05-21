package com.benua.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Document(collection = "public_excursions")
public record PublicExcursion(
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
        @Field("is_published") Boolean isPublished,
        @Field("sort_order") Integer sortOrder
) {
    public record ContentSection(String topic, String content) {}
    public record ExcursionSource(String source, String url) {}
}
